import { AxiosError } from "axios";

export function getErrorMessage(
  err: unknown,
  fallback = "Something went wrong",
): string {
  if ((err as AxiosError<{ message: string; errors?: { message: string }[] }>)?.response?.data) {
    const data = (err as AxiosError<{ message: string; errors?: { message: string }[] }>).response!.data;
    if (data.errors && data.errors.length > 0) {
      return data.errors[0].message;
    }
    if (data.message) {
      return data.message;
    }
  }

  if (err instanceof Error && err.message) {
    return err.message;
  }

  return fallback;
}
