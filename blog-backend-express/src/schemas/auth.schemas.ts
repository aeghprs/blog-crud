import { z } from "zod";

export const userRegistrationSchema = z.object({
  first_name: z
    .string({
      required_error: "First name is required",
    })
    .trim()
    .min(2, "First name must be between 2-100 characters")
    .max(100, "First name must be between 2-100 characters"),

  last_name: z
    .string({
      required_error: "Last name is required",
    })
    .trim()
    .min(2, "Last name must be between 2-100 characters")
    .max(100, "Last name must be between 2-100 characters"),

  email: z
    .string({
      required_error: "Email is required",
    })
    .trim()
    .email("Invalid email format"),

  password: z
    .string({
      required_error: "Password is required",
    })
    .min(8, "Password must be at least 6 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain uppercase, lowercase, number and special character",
    ),

  phone: z
    .string({
      required_error: "Phone is required",
    })
    .trim(),
});

export const userLoginSchema = userRegistrationSchema.pick({
  email: true,
  password: true,
});

export const userUpdateSchema = userRegistrationSchema.partial();

export type IRegisterUser = z.infer<typeof userRegistrationSchema>;
export type ILoginUser = z.infer<typeof userLoginSchema>;
export type IUpdateUser = z.infer<typeof userUpdateSchema>;