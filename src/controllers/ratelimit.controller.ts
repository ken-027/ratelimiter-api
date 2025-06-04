import { Request, Response } from "express";

export async function slidingWindow(
    _request: Request<never, unknown>,
    response: Response,
) {
    response.status(201).json({ access: "granted" });
}
