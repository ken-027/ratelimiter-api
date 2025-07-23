import { BASE_URL } from "@/config/env";
import { Request, Response } from "express";

export async function ratelimitResponse(
    _request: Request<never, unknown>,
    response: Response,
) {
    response.json({ access: "granted" });
}

/**
 * @swagger
 * /api/v2:
 *   get:
 *     summary: list of algorithms available
 *     tags:
 *       - Ratelimit V2
 *     responses:
 *       200:
 *         description: A list of algorithms
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 algorithms:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: Fixed Window Counter
 *                       description:
 *                         type: string
 *                         example: Divides time into fixed windows and counts requests within each window. Simple but can allow traffic spikes at window boundaries.
 *                       link:
 *                         type: string
 *                         format: uri
 *                         example: "https://ratelimiter-api/api/v2/counter/fixed-window"
 */
export async function algorithmList(
    _request: Request<never, unknown>,
    response: Response,
) {
    const listOfAlgorithms: {
        name: string;
        description: string;
        link: string;
    }[] = [
        {
            name: "Fixed Window Counter",
            description:
                "Divides time into fixed windows and counts requests within each window. Simple but can allow traffic spikes at window boundaries.",
            link: `${BASE_URL}/api/v2/counter/fixed-window`,
        },
        {
            name: "Sliding Window Log",
            description:
                "Maintains a log of all request timestamps within the current time window. Most accurate but requires more memory and processing.",
            link: `${BASE_URL}/api/v2/sliding-window-log`,
        },
        {
            name: "Sliding Window Counter",
            description:
                "Hybrid approach that combines fixed windows with sliding behavior. Balances accuracy with efficiency by interpolating between current and previous window.",
            link: `${BASE_URL}/api/v2/counter/sliding-window`,
        },
    ];

    response.json({ algorithms: listOfAlgorithms });
}
