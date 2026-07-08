import { useMutation, useQuery } from "@tanstack/react-query";
import { FolderOpen, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { deleteCategory, fetchCategories } from "api/cat.api";

import { CategoryModal } from "components/Category/CategoryModal";
import ConfirmDialog from "components/Shared/CofirmationDialog";
import { PaginationBar } from "components/Shared/PaginationBar";
import { Button } from "components/ui";
import Loader from "components/ui/Loader";

import ErrorPage from "pages/ErrorPage";

import queryClient from "constants/queryClient";

import { usePagination } from "hook/usePagination";

import { toast } from "store/toastStore";

import type { CategoryData, Pagination } from "types/types";

import { getErrorMessage } from "utils/errorHandler";

const Category = () => {
  const [modalOpen, setModalOpen] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<CategoryData | null>(null);

  const { limit, page, setPage } = usePagination();

  const openCreateModal = (modalType: string) => {
    setSelectedItem(null);
    setModalOpen(modalType);
  };

  const openEditModal = (category: CategoryData) => {
    setSelectedItem(category);
    setModalOpen("edit");
  };

  const closeModal = () => {
    setModalOpen(null);
    setSelectedItem(null);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      closeModal();
    },
    onError: (err) => {
      toast.error(getErrorMessage(err));
    },
  });

  const handleDelete = () => {
    if (!selectedItem?.id) return;

    mutate(selectedItem.id);
  };

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["categories", page, limit],
    queryFn: fetchCategories,
  });

  if (isLoading) {
    return <Loader label="Fetching categories" />;
  }

  if (isError) {
    return (
      <ErrorPage
        title="We couldn't load categories"
        message={getErrorMessage(error)}
        onRetry={() => refetch()}
        retryLabel="Retry loading"
      />
    );
  }

  const {
    data: paginatedCategories,
    pagination,
  }: { data: CategoryData[]; pagination: Pagination } = data;

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-clay-600 dark:text-clay-400">
            Organize
          </p>
          <h1 className="font-display text-3xl font-semibold text-ink-900 dark:text-ink-50">
            Categories
          </h1>
        </div>
        <button
          onClick={() => openCreateModal("create")}
          className="flex items-center gap-1.5 rounded-full bg-ink-900 px-4 py-2 text-sm font-medium text-ink-50 transition hover:bg-ink-800 dark:bg-clay-500 dark:text-ink-950 dark:hover:bg-clay-400"
        >
          <Plus size={15} /> Add category
        </button>
      </div>

      {pagination.total === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-ink-300 py-16 text-center dark:border-ink-700">
          <FolderOpen className="text-ink-400" size={28} />
          <p className="text-sm text-ink-500 dark:text-ink-400">
            No categories yet — add one to start organizing posts.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-ink-200/70 dark:border-ink-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-ink-100/70 dark:bg-ink-900/60">
              <tr>
                <th className="px-4 py-3 font-medium text-ink-600 dark:text-ink-300">
                  Name
                </th>
                <th className="px-4 py-3 font-medium text-ink-600 dark:text-ink-300">
                  Description
                </th>
                <th className="px-4 py-3 text-right font-medium text-ink-600 dark:text-ink-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-200/70 dark:divide-ink-800">
              {paginatedCategories.map((cat) => (
                <tr
                  key={cat.id}
                  className="bg-white/60 transition-colors hover:bg-ink-100/50 dark:bg-ink-900/30 dark:hover:bg-ink-900/60"
                >
                  <td className="px-4 py-3 font-medium text-ink-900 dark:text-ink-50">
                    {cat.name}
                  </td>
                  <td className="max-w-xs px-4 py-3 text-ink-600 dark:text-ink-400">
                    <span className="line-clamp-2">
                      {cat.description || "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        onClick={() => openEditModal(cat)}
                        className="rounded-md p-1.5 text-ink-500 hover:bg-ink-200/70 hover:text-ink-900 dark:text-ink-400 dark:hover:bg-ink-800"
                        aria-label={`Edit ${cat.name}`}
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        onClick={() => {
                          setModalOpen("delete");
                          setSelectedItem(cat);
                        }}
                        className="rounded-md p-1.5 text-ink-500 hover:bg-clay-500/10 hover:text-clay-600 dark:text-ink-400 dark:hover:text-clay-400"
                        aria-label={`Delete ${cat.name}`}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <PaginationBar
        page={page}
        setPage={setPage}
        totalPages={pagination.totalPages}
      />
      <Link
        to="/posts/new"
        className="text-underline text-xs hover:text-clay-500"
      >
        Back to blog
      </Link>

      <CategoryModal
        open={modalOpen === "create" || modalOpen === "edit"}
        category={selectedItem}
        onClose={closeModal}
      />

      <ConfirmDialog
        open={modalOpen === "delete"}
        title="Delete this category?"
        message={`"${selectedItem?.name}" will be permanently removed. Are you sure you want to delete this category?`}
        busy={isPending}
        confirmLabel="Delete category"
        busyLabel="Deleting…"
        onConfirm={handleDelete}
        onCancel={() => setSelectedItem(null)}
      />
    </div>
  );
};

export default Category;
