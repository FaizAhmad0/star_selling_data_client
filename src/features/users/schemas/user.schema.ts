import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  enrollment: z.string().min(1, "Enrollment number is required"),
  primaryContact: z.string().min(1, "Phone number is required").min(10, "Phone number must be at least 10 digits").max(15, "Phone number is too long"),
  date: z.string().min(1, "Joining date is required"),
  batch: z.string().min(1, "Batch is required"),
  manager: z.string().min(1, "Manager is required"),
  enrolledBy: z.string().optional(),
});

export type CreateUserFormInput = z.infer<typeof createUserSchema>;
