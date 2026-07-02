import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "api/auth.api";

import { Button, TextField } from "components/ui";

import { useFetchUser } from "hook/useFetchUser";

import { userLoginSchema, type ILoginUser } from "schema/auth";

import { useAuthStore } from "store/authStore";
import { toast } from "store/toastStore";

import { getErrorMessage } from "utils/errorHandler";

export default function Login() {
  const navigate = useNavigate();
  const { setTokens } = useAuthStore();
  const { refetch: fetchUserData } = useFetchUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginUser>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: async ({ data, message }) => {
      setTokens(data?.accessToken || "", data?.refreshToken || "");

      toast.success(message ?? "Login successful.");

      await fetchUserData();
      navigate("/dashboard");
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err));
    },
  });

  const onSubmit = (data: ILoginUser) => mutate(data);

  return (
    <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-md flex-col justify-center px-5 py-12">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-semibold text-ink-900 dark:text-ink-50">
          Start writing
        </h1>
        <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">
          Create an account to publish your first post.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <TextField
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />

        <Button type="submit" fullWidth size="lg" loading={isPending}>
          {isPending ? "Logging in..." : "Log In"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500 dark:text-ink-400">
        New here?{" "}
        <Link
          to="/register"
          className="font-medium text-clay-600 hover:underline dark:text-clay-400"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
