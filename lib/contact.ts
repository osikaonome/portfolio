import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Please add your name").max(100),
  email: z.email("Please add a valid email address").max(200),
  message: z.string().trim().min(10, "Please write a little more").max(5000),
  // Honeypot: hidden from people, filled in by bots. The route drops these silently.
  company: z.string().max(200).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
