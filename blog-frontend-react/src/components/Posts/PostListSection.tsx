import { FileQuestion, Search } from "lucide-react";
import { useMemo, useState, type Dispatch, type SetStateAction } from "react";

import { PaginationBar } from "components/Shared/PaginationBar";

import PostCard from "components/Posts/PostCard";

import type { PostListItem } from "types/types";

interface PostListSectionProps {
  posts: PostListItem[];
  currentUserId?: number;
  onDelete?: (post: PostListItem) => void;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  totalPages: number;
}

const PostListSection = ({
  posts,
  currentUserId,
  onDelete,
  page,
  setPage,
  totalPages,
}: PostListSectionProps) => {
  const [search, setSearch] = useState("");

  const filteredPosts = useMemo(() => {
    const normalizedQuery = search.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        post.title.toLowerCase().includes(normalizedQuery) ||
        post.excerpt.toLowerCase().includes(normalizedQuery) ||
        post.category_name.toLowerCase().includes(normalizedQuery) ||
        post.user_name.toLowerCase().includes(normalizedQuery);

      return matchesQuery;
    });
  }, [posts, search,]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const emptyMessage =
    filteredPosts.length === 0 && (search)
      ? `Nothing matches "${search}".`
      : "No posts of your own yet — write the first one.";

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
          />
          <input
            value={search}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Search posts…"
            className="w-full rounded-md border border-ink-200 bg-white py-2 pl-9 pr-4 text-sm outline-none transition focus:border-clay-500 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50"
          />
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-ink-300 py-16 text-center dark:border-ink-700">
          <FileQuestion className="text-ink-400" size={28} />
          <p className="text-sm text-ink-500 dark:text-ink-400">
            {emptyMessage}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              canManage={post.user_id === currentUserId}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      <PaginationBar page={page} setPage={setPage} totalPages={totalPages} />
    </div>
  );
};

export default PostListSection;
