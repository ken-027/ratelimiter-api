import { Email } from "@/types";
import { z, ZodTypeAny } from "zod";

export const sendEmail = z
    .object<Record<keyof Email, ZodTypeAny>>({
        name: z.string().trim().max(30).min(3),
        subject: z.string().trim().max(100).min(5),
        email: z.string().trim().email(),
        message: z.string().trim().max(500).min(3),
    })
    .required();
