import { useState } from "react";

export const usePagination = () => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const [searchQuery, setSearchQuery] = useState("");

  return { limit, setLimit, page, setPage, searchQuery, setSearchQuery };
};
