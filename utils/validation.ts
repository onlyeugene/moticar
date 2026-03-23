import * as z from "zod";

export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Enter a valid email address");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(50, "Password is too long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const otpSchema = z.object({
  otp: z.string().length(5, "Code must be 5 digits"),
});

export const authSchema = z.object({
  otp: otpSchema,
  email: emailSchema,
  password: passwordSchema,
});
