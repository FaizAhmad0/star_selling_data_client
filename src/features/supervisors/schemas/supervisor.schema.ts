import { z } from "zod";

export const createSupervisorSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  primaryContact: z.string().min(1, "Phone number is required").min(10, "Phone number must be at least 10 digits").max(15, "Phone number is too long"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
});

export type CreateSupervisorFormInput = z.infer<typeof createSupervisorSchema>;
