import { AxiosError } from "axios";

export function getErrorMessage(
  err: unknown,
  fallback = "Something went wrong",
): string {
  if ((err as AxiosError<{ message: string }>)?.response?.data?.message) {
    return (err as AxiosError<{ message: string }>).response!.data!.message;
  }

  if (err instanceof Error && err.message) {
    return err.message;
  }

  return fallback;
}
