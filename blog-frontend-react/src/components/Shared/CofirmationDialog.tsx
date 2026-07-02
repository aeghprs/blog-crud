import { Button } from "components/ui";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  busy?: boolean;
  confirmLabel?: string;
  busyLabel?: string;
};

export default function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  busy,
  confirmLabel = "Delete",
  busyLabel = "Deleting…",
}: ConfirmDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-xl border border-ink-200 bg-white p-5 shadow-xl dark:border-ink-800 dark:bg-ink-900">
        <h3 className="font-display text-lg font-semibold text-ink-900 dark:text-ink-50">
          {title}
        </h3>
        <p className="mt-1.5 text-sm text-ink-600 dark:text-ink-400">
          {message}
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button onClick={onCancel} disabled={busy} variant="secondary">
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={busy}>
            {busy ? busyLabel : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
