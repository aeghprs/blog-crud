import { useQuery } from "@tanstack/react-query";
import { ArrowLeft  } from "lucide-react";
import { useNavigate, useParams,  } from "react-router-dom";

import { getBlogPostById } from "api/blogs.api";

import { Button } from "components/ui";
import Loader from "components/ui/Loader";

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  if (!id) return <p>Invalid post ID</p>;

  const { data: blogPost, isLoading } = useQuery({
    queryKey: ["blogPostById", id],
    queryFn: () => getBlogPostById(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return <Loader label="Loading post..." />;
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full bg-ink-100 px-2.5 py-0.5 text-xs font-medium text-ink-600 dark:bg-ink-800 dark:text-ink-300">
          {blogPost.category_name}
        </span>
      </div>

      <h1 className="font-display text-4xl font-semibold leading-tight text-ink-900 dark:text-ink-50">
        {blogPost.title}
      </h1>
      <p className="mt-3 font-mono text-xs text-ink-400 dark:text-ink-500">
        by {blogPost.user_name} ·{" "}
        {new Date(blogPost.created_at).toLocaleDateString(undefined, {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </p>

      <div
        className="ProseMirror mt-8 text-ink-800 dark:text-ink-200"
        dangerouslySetInnerHTML={{ __html: blogPost.content }}
      />

      {blogPost.tags?.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {blogPost.tags.map((tag: string) => (
            <span
              key={tag}
              className="rounded-full bg-clay-100 px-2.5 py-1 text-xs font-medium text-clay-700 dark:bg-clay-900/40 dark:text-clay-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="my-10 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-ink-100"
      >
        <ArrowLeft size={15} /> Back to dashboard
      </Button>
    </div>
  );
}
