import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

import { fetchCategories } from "api/cat.api";
import { createNewBlog, getBlogPostById, updateBlog } from "api/blogs.api";

import { Button, SelectField, TagInputField, TextField } from "components/ui";
import {
  fieldErrorClassName,
  fieldLabelClassName,
} from "components/ui/fieldStyles";
import { RichTextEditor } from "components/TextEditor/RichTextEditor";
import Loader from "components/ui/Loader";

import queryClient from "constants/queryClient";

import { blogCreateSchema } from "schema/blog";

import { useAuthStore } from "store/authStore";

import type { CategoryData, PostFormValues } from "types/types";

import { toast } from "store/toastStore";

import { getErrorMessage } from "utils/errorHandler";

const EMPTY_CONTENT_COPY = "";

export default function PostForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  useAuthStore((state) => state.user);
  const postId = Number(id);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<PostFormValues>({
    resolver: zodResolver(blogCreateSchema),
    defaultValues: {
      title: "",
      category_id: 0,
      content: EMPTY_CONTENT_COPY,
      excerpt: "",
      tags: [],
    },
  });

  const { data: existingPost, isLoading: isLoadingPost } = useQuery({
    queryKey: ["blogPostById", id],
    queryFn: () => getBlogPostById(postId),
    enabled: isEdit && !!id,
  });

  useEffect(() => {
    if (isEdit && existingPost) {
      reset({
        title: existingPost.title ?? "",
        category_id: Number(existingPost.category_id ?? 0),
        content: existingPost.content ?? EMPTY_CONTENT_COPY,
        excerpt: existingPost.excerpt ?? "",
        tags: Array.isArray(existingPost.tags) ? existingPost.tags : [],
      });
    }
  }, [existingPost, isEdit, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: (values: PostFormValues) =>
      isEdit ? updateBlog(postId, values) : createNewBlog(values),
    onSuccess: async ({ message }) => {
      toast.success(
        message ??
          (isEdit
            ? "Blog post updated successfully."
            : "Blog post created successfully."),
      );
      queryClient.invalidateQueries({ queryKey: ["blogs"] });

      if (isEdit) {
        queryClient.invalidateQueries({ queryKey: ["blogPostById", id] });
        navigate(`/posts/${id}`);
      } else {
        reset();
        navigate("/dashboard");
      }
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err));
    },
  });

  const onSubmit = (values: PostFormValues) => {
    const { category_id, ...payload } = values;
    mutate({
      ...payload,
      category_id: Number(category_id),
    });
  };

  const { data, isLoading } = useQuery({
    queryKey: ["categories", 1, 10],
    queryFn: fetchCategories,
  });

  if (isLoading || (isEdit && isLoadingPost)) {
    return <Loader label={isEdit ? "Loading post" : "Fetching categories"} />;
  }

  const CATEGORY_OPTIONS =
    data?.data.map((cat: CategoryData) => ({
      value: cat.id.toString(),
      label: cat.name,
    })) || [];

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <p className="font-mono text-xs uppercase tracking-wider text-clay-600 dark:text-clay-400">
        {isEdit ? "Edit post" : "New post"}
      </p>
      <h1 className="mb-8 font-display text-3xl font-semibold text-ink-900 dark:text-ink-50">
        {isEdit ? "Refine your post" : "Write something new"}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <TextField
          label="Title"
          placeholder="A working title"
          error={errors.title?.message}
          {...register("title")}
        />

        <SelectField
          label="Category"
          placeholder="Choose a category"
          options={CATEGORY_OPTIONS}
          error={errors.category_id?.message}
          {...register("category_id")}
        />
        <Link
          to="/category"
          className="text-underline text-xs hover:text-clay-500"
        >
          Create new Category ?
        </Link>

        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <div>
              <label className={fieldLabelClassName}>Content</label>
              <RichTextEditor
                value={field.value}
                onChange={field.onChange}
                placeholder="Start writing..."
              />
              {errors.content && (
                <p className={fieldErrorClassName}>{errors.content.message}</p>
              )}
            </div>
          )}
        />

        <TextField
          label="Excerpt"
          placeholder="A working excerpt"
          error={errors.excerpt?.message}
          {...register("excerpt")}
        />

        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <TagInputField
              label="Tags"
              placeholder="Add a tag and press Enter"
              helperText="Type a new tag"
              suggestions={[]}
              creatable
              value={field.value}
              onChange={field.onChange}
              error={errors.tags?.message}
            />
          )}
        />

        <div className="flex gap-3 pt-2 justify-end">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate(-1)}
            loading={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" loading={isPending}>
            {isEdit ? "Save changes" : "Publish post"}
          </Button>
        </div>
      </form>
    </div>
  );
}
