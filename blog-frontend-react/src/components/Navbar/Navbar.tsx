import { PenLine, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import ThemeToggle from "components/theme/ThemeToggle";
import { Button } from "components/ui";

import { useAuthStore } from "store/authStore";

export default function Navbar() {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const logout = useAuthStore((state) => state.logout);

  const navigate = useNavigate();
  const isLoggedIn = Boolean(user && accessToken);

  return (
    <header className="sticky top-0 z-20 border-b border-ink-200/70 bg-ink-50/90 backdrop-blur dark:border-ink-800/70 dark:bg-ink-950/90">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <Link to="/" className="group flex items-center gap-2">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-ink-900 text-ink-50 dark:bg-clay-500 dark:text-ink-950">
            <span className="font-display text-sm font-semibold">M</span>
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            Marginalia
          </span>
        </Link>

        <nav className="flex items-center gap-1.5">
          <ThemeToggle />
          {isLoggedIn ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="gap-1.5"
                onClick={() => navigate("/posts/new")}
              >
                <PenLine size={14} />
                <span className="hidden sm:inline">Write</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="ml-1 text-ink-500 hover:text-clay-600 dark:text-ink-400 dark:hover:text-clay-400"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                title="Log out of your account"
                aria-label="Log out"
              >
                <LogOut size={18} />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/login")}
              >
                Log in
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate("/register")}
              >
                Sign up
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
