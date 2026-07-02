export default function Loader({ label = "Loading" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink-500 dark:text-ink-400">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-ink-200 border-t-clay-500 dark:border-ink-700 dark:border-t-clay-400"
        role="status"
        aria-label={label}
      />
      <p className="font-mono text-xs tracking-wide">{label}…</p>
    </div>
  );
}
