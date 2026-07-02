import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { createNewCategory, updateCategory } from "api/cat.api";

import { Button, TextField } from "components/ui";

import queryClient from "constants/queryClient";
import {
  categoryCreateSchema,
  type ICreateCategory,
} from "schema/category";

import { toast } from "store/toastStore";

import type { CategoryData } from "types/types";

import { getErrorMessage } from "utils/errorHandler";

type CategoryModalProps = {
  open: boolean;
  category: CategoryData | null;
  onClose: () => void;
};

export const CategoryModal = ({
  open,
  category,
  onClose,
}: CategoryModalProps) => {
  const isEdit = !!category;
  const schema = isEdit ? categoryCreateSchema.partial() : categoryCreateSchema;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "" },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: category?.name || "",
        description: category?.description || "",
      });
    }
  }, [open, category, reset]);

  const mutationFunc = isEdit
    ? (data: ICreateCategory) => updateCategory(Number(category!.id), data)
    : createNewCategory;

  const { mutate, isPending } = useMutation({
    mutationFn: mutationFunc,
    onSuccess: async ({ message }) => {
      toast.success(message ?? "Category created successfully.");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      onClose();
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err));
    },
  });

  const onSubmit = (data: ICreateCategory) => mutate(data);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-ink-200 bg-white p-5 shadow-xl dark:border-ink-800 dark:bg-ink-900">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-ink-900 dark:text-ink-50">
            {isEdit ? "Edit category" : "Add category"}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700 dark:hover:bg-ink-800 dark:hover:text-ink-200"
          >
            <X size={16} />
          </Button>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <TextField
            label="Name"
            autoComplete="given-name"
            error={errors.name?.message}
            {...register("name")}
          />

          <TextField
            label="Description"
            autoComplete="family-name"
            error={errors.description?.message}
            {...register("description")}
          />
          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="submit"
              variant="secondary"
              size="md"
              loading={isPending}
              onClick={() => onClose()}
            >
              Cancel
            </Button>
            <Button type="submit" size="md" loading={isPending}>
              {isPending ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
