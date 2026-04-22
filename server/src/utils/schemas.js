import { z } from "zod";

export const TaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(160),
  description: z.string().optional().default(""),
  status: z.enum(["todo", "in_progress", "done"]).default("todo"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  dueDate: z.string().nullable().optional(),
  assigneeId: z.string().uuid().nullable().optional(),
});

export const UserSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  password: z.string().min(6).optional(),
});

export const InviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["admin", "member"]).default("member"),
});
