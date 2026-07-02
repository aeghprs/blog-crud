import { z } from "zod";

export const baseRegistrationSchema = z.object({
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
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain uppercase, lowercase, number and special character",
    ),

  phone: z
    .string({
      required_error: "Phone is required",
    })
    .trim()
    .min(1, "Phone is required"),
});

//  schema with confirmPassword
export const userRegistrationSchema = baseRegistrationSchema
  .extend({
    confirmPassword: z
      .string({
        required_error: "Confirm password is required",
      })
      .min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const userLoginSchema = baseRegistrationSchema.pick({
  email: true,
  password: true,
});

export const userUpdateSchema = baseRegistrationSchema.partial();

export type IRegisterUser = z.infer<typeof userRegistrationSchema>;
export type IRegisterPayload = z.infer<typeof baseRegistrationSchema>;
export type ILoginUser = z.infer<typeof userLoginSchema>;
export type IUpdateUser = z.infer<typeof userUpdateSchema>;
