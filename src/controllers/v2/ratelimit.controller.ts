import { Request, Response } from "express";

export async function ratelimitResponse(
    _request: Request<never, unknown>,
    response: Response,
) {
    response.json({ access: "granted" });
}

export async function algorithmList(
    _request: Request<never, unknown>,
    response: Response,
) {
    const listOfAlgorithms: { name: string; description: string }[] = [
        { name: "Sliding Window", description: "sliding window algorithm" },
    ];

    response.json({ algorithms: listOfAlgorithms });
}
