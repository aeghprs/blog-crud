import { useNavigate } from "react-router-dom";

import { Button } from "components/ui";

type ErrorPageProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
};

export default function ErrorPage({
  title = "Something went wrong",
  message = "We couldn't complete that request right now. Please try again in a moment.",
  onRetry,
  retryLabel = "Try again",
}: ErrorPageProps) {
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-lg flex-col items-center justify-center px-5 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-clay-600 dark:text-clay-400">
        Error
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink-900 dark:text-ink-50">
        {title}
      </h1>
      <p className="mt-3 text-sm text-ink-600 dark:text-ink-400">
        {message}
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {onRetry ? (
          <Button size="md" onClick={onRetry}>
            {retryLabel}
          </Button>
        ) : null}
        <Button variant="secondary" size="md" onClick={() => navigate("/")}>
          Back home
        </Button>
      </div>
    </div>
  );
}
