import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "api/auth.api";

import { Button, TextField } from "components/ui";

import { userRegistrationSchema, type IRegisterUser } from "schema/auth";

import { toast } from "store/toastStore";

import { getErrorMessage } from "utils/errorHandler";

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegisterUser>({
    resolver: zodResolver(userRegistrationSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      toast.success(data.message ?? "Registration successful. Please log in.");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err));
    },
  });

  const onSubmit = (data: IRegisterUser) => mutate(data);

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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <TextField
          label="First Name"
          autoComplete="given-name"
          error={errors.first_name?.message}
          {...register("first_name")}
        />

        <TextField
          label="Last Name"
          autoComplete="family-name"
          error={errors.last_name?.message}
          {...register("last_name")}
        />

        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <TextField
          label="Phone"
          type="tel"
          autoComplete="tel"
          placeholder="+1 555 000 0000"
          error={errors.phone?.message}
          {...register("phone")}
        />

        <TextField
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />

        <TextField
          label="Confirm Password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <Button type="submit" fullWidth size="lg" loading={isPending}>
          {isPending ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500 dark:text-ink-400">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-clay-600 hover:underline dark:text-clay-400"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
