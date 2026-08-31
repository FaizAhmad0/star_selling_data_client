import { z } from "zod";

export const createPlatformSchema = z.object({
  name: z
    .string()
    .min(1, "Platform name is required")
    .max(100, "Name is too long"),
  status: z.enum(["active", "inactive"]).optional(),
});

export type CreatePlatformFormInput = z.infer<typeof createPlatformSchema>;
