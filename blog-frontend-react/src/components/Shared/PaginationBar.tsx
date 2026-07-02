import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

import { Button } from "components/ui";

interface PaginationBarProps {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  totalPages: number;
}

export const PaginationBar = ({
  page,
  setPage,
  totalPages,
}: PaginationBarProps) => {
  console.log(page, totalPages);
  return (
    <div className="mt-8 flex items-center justify-center gap-3">
      <Button
        variant="ghost"
        size="icon"
        type="button"
        onClick={() => setPage((page: number) => Math.max(1, page - 1))}
        disabled={page === totalPages}
        className="rounded-full p-2 text-ink-500 hover:bg-ink-200/60 disabled:opacity-30 dark:text-ink-400 dark:hover:bg-ink-800"
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </Button>
      <span className="font-mono text-xs text-ink-500 dark:text-ink-400">
        Page {page} of {totalPages}
      </span>
      <Button
        variant="ghost"
        size="icon"
        type="button"
        onClick={() =>
          setPage((page: number) => Math.min(totalPages, page + 1))
        }
        disabled={page === totalPages}
        className="rounded-full p-2 text-ink-500 hover:bg-ink-200/60 disabled:opacity-30 dark:text-ink-400 dark:hover:bg-ink-800"
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </Button>
    </div>
  );
};
