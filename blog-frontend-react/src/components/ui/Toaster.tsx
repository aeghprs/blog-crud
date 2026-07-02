import { AlertCircle, CheckCircle, X } from "lucide-react";

import { useToastStore } from "store/toastStore";

export default function Toaster() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 w-full max-w-[380px] p-4 sm:p-0 pointer-events-none">
      {toasts.map((t) => {
        const isSuccess = t.type === "success";

        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 w-full rounded-xl border bg-white p-4 shadow-xl dark:bg-ink-900 transition-all duration-300 animate-slide-in ${
              isSuccess
                ? "border-moss-500/20 dark:border-moss-500/30"
                : "border-clay-500/20 dark:border-clay-500/30"
            }`}
          >
            {isSuccess ? (
              <CheckCircle className="h-5 w-5 shrink-0 text-moss-500" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0 text-clay-500" />
            )}

            <div className="flex-1 text-sm font-medium leading-5 text-ink-800 dark:text-ink-200">
              {t.message}
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="shrink-0 text-ink-400 hover:text-ink-600 transition-colors dark:text-ink-500 dark:hover:text-ink-300"
              aria-label="Close notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
