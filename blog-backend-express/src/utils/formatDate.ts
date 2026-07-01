export const normalizeDate = (
  input?: string | Date,
  type: "date" | "timestamp" = "date",
): string | undefined => {
  if (!input) return undefined;

  if (type === "date") {
    if (typeof input === "string") return input;

    return input.toISOString().split("T")[0];
  } else {
    return input instanceof Date
      ? input.toISOString()
      : new Date(input).toISOString();
  }
};