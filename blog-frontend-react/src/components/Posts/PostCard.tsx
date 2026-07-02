import { Pencil, Trash2 } from "lucide-react";

import { Link } from "react-router-dom";

import type { PostListItem } from "types/types";

import { formatDate } from "utils/helper";


interface PostCard {
  post: PostListItem;
  canManage: boolean;
  onDelete?: (post: PostListItem) => void;
}

export default function PostCard({ post, canManage, onDelete }: PostCard) {
  return (
    <article className="group relative flex gap-4 rounded-xl border border-ink-200/70 bg-white/60 p-5 transition-colors hover:border-clay-400/50 dark:border-ink-800 dark:bg-ink-900/40">
      {/* manuscript-margin rule: this app's signature structural device */}
      <div className="hidden w-4 shrink-0 flex-col items-center sm:flex">
        <div className="h-full w-px bg-ink-200 dark:bg-ink-800" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${"bg-ink-200 text-ink-600"}`}
          >
            {post.category_name}
          </span>
          <span className="font-mono text-xs text-ink-400 dark:text-ink-500">
            {formatDate(post.created_at)}
          </span>
        </div>

        <Link to={`/posts/${post.id}`} className="block">
          <h3 className="font-display text-xl font-semibold leading-snug text-ink-900 group-hover:text-clay-600 dark:text-ink-50 dark:group-hover:text-clay-400">
            {post.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-600 dark:text-ink-400">
            {post.excerpt}
          </p>
        </Link>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-ink-400 dark:text-ink-500">
            by {post.user_name}
          </span>
          {canManage && (
            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <Link
                to={`/posts/${post.id}/edit`}
                className="rounded-md p-1.5 text-ink-500 hover:bg-ink-200/70 hover:text-ink-900 dark:text-ink-400 dark:hover:bg-ink-800"
                aria-label="Edit post"
              >
                <Pencil size={14} />
              </Link>
              <button
                onClick={() => onDelete?.(post)}
                className="rounded-md p-1.5 text-ink-500 hover:bg-clay-500/10 hover:text-clay-600 dark:text-ink-400 dark:hover:text-clay-400"
                aria-label="Delete post"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
