import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
export function validateRequest(schema: ZodSchema, type: "body" | "query") {
    return (request: Request, _response: Response, next: NextFunction) => {
        schema.parse(request[type as never]);
        next();
    };
}
