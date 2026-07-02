import { useState } from "react";

export const usePagination = () => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  return { limit, setLimit, page, setPage };
};
