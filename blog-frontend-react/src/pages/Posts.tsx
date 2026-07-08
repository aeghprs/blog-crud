import { useQuery } from "@tanstack/react-query";

import { fetchAllBlogs } from "api/blogs.api";

import { getErrorMessage } from "utils/errorHandler";

import Loader from "components/ui/Loader";
import PostListSection from "components/Posts/PostListSection";

import ErrorPage from "pages/ErrorPage";

import { usePagination } from "hook/usePagination";

export default function Posts() {
  const { limit, page, setPage, searchQuery, setSearchQuery } = usePagination();

  const {
    data: postsData,
    isLoading: isPostsLoading,
    isError: isPostsError,
    error: postsError,
    refetch: refetchPosts,
  } = useQuery({
    queryKey: ["blogs", page, limit, searchQuery],
    queryFn: fetchAllBlogs,
  });

  if (isPostsLoading) {
    return <Loader label="Loading" />;
  }

  if (isPostsError) {
    return (
      <ErrorPage
        title="We couldn't load the posts"
        message={getErrorMessage(postsError)}
        onRetry={() => refetchPosts()}
        retryLabel="Retry loading"
      />
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <PostListSection
        posts={postsData.data}
        page={page}
        setPage={setPage}
        totalPages={postsData.pagination.totalPages}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </div>
  );
}
