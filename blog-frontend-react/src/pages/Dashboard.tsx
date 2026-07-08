import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { deleteBlog, fetchBlogs } from "api/blogs.api";

import Loader from "components/ui/Loader";
import PostListSection from "components/Posts/PostListSection";
import ConfirmDialog from "components/Shared/CofirmationDialog";

import ErrorPage from "pages/ErrorPage";

import queryClient from "constants/queryClient";

import { usePagination } from "hook/usePagination";

import { useAuthStore } from "store/authStore";
import { toast } from "store/toastStore";

import type { PostListItem } from "types/types";

import { getErrorMessage } from "utils/errorHandler";

const Dashboard = () => {
  const { user } = useAuthStore();
  const [pendingDelete, setPendingDelete] = useState<PostListItem | null>(null);
  const { limit, page, setPage, searchQuery, setSearchQuery } = usePagination();

  const {
    data: postsData,
    isLoading: isPostsLoading,
    isError: isPostsError,
    error: postsError,
    refetch: refetchPosts,
  } = useQuery({
    queryKey: ["posts", page, limit, searchQuery],
    queryFn: fetchBlogs,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (id: number) => deleteBlog(id),
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setPendingDelete(null);
    },
    onError: (err) => {
      toast.error(getErrorMessage(err));
    },
  });

  const handleDelete = () => {
    if (!pendingDelete?.id) return;

    mutate(pendingDelete.id);
  };

  if (isPostsLoading) {
    return <Loader label="Loading" />;
  }

  if (isPostsError) {
    return (
      <ErrorPage
        title="We couldn't load your dashboard"
        message={getErrorMessage(postsError)}
        onRetry={() => refetchPosts()}
        retryLabel="Retry loading"
      />
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <div className="mb-8 flex flex-col gap-1">
        <p className="font-mono text-xs uppercase tracking-wider text-clay-600 dark:text-clay-400">
          Dashboard
        </p>
        <h1 className="font-display text-3xl font-semibold text-ink-900 dark:text-ink-50">
          Welcome back, {user?.first_name || "writer"}
        </h1>
      </div>

      <PostListSection
        posts={postsData.data}
        currentUserId={user?.id}
        onDelete={setPendingDelete}
        page={page}
        setPage={setPage}
        totalPages={postsData.pagination.totalPages}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete blog?"
        message={`Delete "${pendingDelete?.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
        busy={isPending}
        confirmLabel="Delete"
        busyLabel="Deleting…"
      />
    </div>
  );
};

export default Dashboard;
