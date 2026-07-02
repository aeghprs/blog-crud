import { useNavigate } from "react-router-dom";

import { Button } from "components/ui";

import { useAuthStore } from "store/authStore";

export default function Home() {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);

  const isLoggedIn = Boolean(user && accessToken);

  const navigate = useNavigate();

  return (
    <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-3xl flex-col items-center justify-center px-5 text-center">
      <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-clay-600 dark:text-clay-400">
        A quiet place to write
      </p>
      <h1 className="font-display text-5xl font-semibold leading-tight text-ink-900 dark:text-ink-50 sm:text-6xl">
        Marginalia
      </h1>
      <p className="mt-5 max-w-lg text-balance text-ink-600 dark:text-ink-400">
        Draft, publish, and revise posts in a simple space built for writing —
        no distractions, just your words and the margin around them.
      </p>
      <div className="mt-8 flex gap-3">
        <Button
          size="lg"
          className="px-6"
          onClick={() => navigate(isLoggedIn ? "/dashboard" : "/login")}
        >
          {isLoggedIn ? "Go to dashboard" : "Start writing"}
        </Button>

        <Button
          size="lg"
          className="px-6"
          variant="secondary"
          onClick={() => navigate("/posts")}
        >
          {"Read Blogs"}
        </Button>
      </div>
    </div>
  );
}
