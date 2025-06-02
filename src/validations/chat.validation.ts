import { Chat } from "@/types";
import { z, ZodTypeAny } from "zod";

export const chat = z
    .object<Record<keyof Chat, ZodTypeAny>>({
        message: z.string().trim().max(500).min(1),
    })
    .required();
