import { useQuery } from "@tanstack/react-query";

import { fetchAllBlogs } from "api/blogs.api";

import Loader from "components/ui/Loader";
import PostListSection from "components/Posts/PostListSection";

import { usePagination } from "hook/usePagination";

export default function Posts() {
  const { limit, page, setPage } = usePagination();

  const { data: postsData, isLoading: isPostsLoading } = useQuery({
    queryKey: ["blogs", page, limit],
    queryFn: fetchAllBlogs,
  });

  if (isPostsLoading) {
    return <Loader label="Loading" />;
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <PostListSection
        posts={postsData.data}
        page={page}
        setPage={setPage}
        totalPages={postsData.pagination.totalPages}
      />
    </div>
  );
}
