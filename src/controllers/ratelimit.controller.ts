import { Request, Response } from "express";

export async function fixedWindow(
    _request: Request<never, unknown>,
    response: Response,
) {
    response.status(201).json({ access: "granted" });
}
