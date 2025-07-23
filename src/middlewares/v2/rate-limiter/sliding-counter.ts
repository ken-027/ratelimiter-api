import BaseMiddleware from "./base-middleware";
import { Algorithm } from "@/types/rate-limit";
import { Request, Response } from "express";
import SlidingCounter from "@/algorithms/sliding-counter";

/**
 * @swagger
 * /api/v2/counter/sliding-window:
 *   post:
 *     summary: sliding window counter log algorithm
 *     tags:
 *       - Ratelimit V2
 *     parameters:
 *       - in: header
 *         name: x-ratelimit-limit
 *         schema:
 *           type: string
 *           enum: [ADMIN, BURSTY, NORMAL, PREMIUM, STRICT]
 *         required: false
 *         description: Optional override for request limit
 *       - in: header
 *         name: x-ratelimit-window
 *         schema:
 *           type: string
 *           enum: [SECOND, MINUTE, HOUR, DAY, WEEK, MONTH, YEAR]
 *         required: false
 *         description: Optional override for rate-limiter window
 *       - in: header
 *         name: x-client-id
 *         schema:
 *           type: string
 *         required: false
 *         description: Optional override for key of ratelimit
 *     responses:
 *       200:
 *         description: Platforms list with rate-limit metadata
 *         headers:
 *           x-ratelimit-limit:
 *             description: Maximum requests allowed in this window
 *             schema:
 *               type: integer
 *           x-ratelimit-remaining:
 *             description: Requests remaining in this window
 *             schema:
 *               type: integer
 *           x-ratelimit-reset:
 *             description: Seconds until limit resets
 *             schema:
 *               type: integer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access:
 *                   type: string
 *                   enum: [granted, denied]
 *                   example: granted
 *             example:
 *               access: granted
 */
export default class SlidingCounterMiddleware extends BaseMiddleware {
    constructor(request: Request, response: Response) {
        super(request, response);

        this.availableLimit = this.availableLimit.filter(
            (limit) => limit !== "ADMIN",
        );
    }

    factoryClass(): Algorithm {
        return new SlidingCounter();
    }
}
