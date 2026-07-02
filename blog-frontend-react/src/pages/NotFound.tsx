import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-md flex-col items-center justify-center px-5 text-center">
      <p className="font-display text-6xl font-semibold text-ink-300 dark:text-ink-700">
        404
      </p>
      <h1 className="mt-3 font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">
        This page doesn't exist, or was moved.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-md bg-ink-900 px-5 py-2.5 text-sm font-medium text-ink-50 hover:bg-ink-800 dark:bg-clay-500 dark:text-ink-950"
      >
        Back home
      </Link>
    </div>
  );
}
