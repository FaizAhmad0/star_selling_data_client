import { z } from "zod";

export const loginSchema = z.object({
  uid: z
    .string()
    .min(1, "UID is required")
    .regex(/^UID\d+$/, "UID must be in format UID followed by numbers (e.g. UID1)"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;
