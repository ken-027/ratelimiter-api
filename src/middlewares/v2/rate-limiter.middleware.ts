import FixedWindow from "@/algorithms/fixed-window";
import HTTPCodes from "@/enum/http-codes.enum";
import { Limit, TimeLimit } from "@/enum/limiter.enum";
import { BadRequestError } from "@/errors/bad-request.error";
import { getClientId } from "@/utils/getIP.util";
import { NextFunction, Request, Response } from "express";

type LimitKey = keyof typeof Limit;
type TimeLimitKey = keyof typeof TimeLimit;

/**
 * @swagger
 * /api/v2/counter/fixed-window:
 *   post:
 *     summary: fixed window counter algorithm
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
export async function fixedWindowMiddleware(
    request: Request,
    response: Response,
    next: NextFunction,
) {
    const ratelimiter = new FixedWindow();

    const clientId = getClientId(request);

    const limitHeaderName = "x-ratelimit-limit";
    const timeLimitHeaderName = "x-ratelimit-window";

    const timeLimitConfig = request.headers[timeLimitHeaderName]?.toString();
    const limitConfig = request.headers[limitHeaderName]?.toString();

    const availableTimeLimit: TimeLimitKey[] = [
        "DAY",
        "HOUR",
        "MINUTE",
        "MONTH",
        "SECOND",
        "WEEK",
        "YEAR",
    ];

    const availableLimit: LimitKey[] = [
        "ADMIN",
        "BURSTY",
        "NORMAL",
        "PREMIUM",
        "STRICT",
    ];

    if (timeLimitConfig) {
        const keyTimeLimit = timeLimitConfig.toUpperCase();

        if (!availableTimeLimit.includes(keyTimeLimit as never))
            throw new BadRequestError(
                `Available options are ${availableTimeLimit.join(", ")} for header '${timeLimitHeaderName}'`,
            );

        ratelimiter.setTimeLimit(TimeLimit[keyTimeLimit as TimeLimitKey]);
    }

    if (limitConfig) {
        const keyLimit = limitConfig.toUpperCase();

        if (!availableLimit.includes(keyLimit as never))
            throw new BadRequestError(
                `Available options are ${availableLimit.join(", ")} for header '${limitHeaderName}'`,
            );

        ratelimiter.setLimit(Limit[keyLimit as LimitKey]);
    }

    const isAllowed = await ratelimiter.isAllowed(clientId);

    request.body = {
        rateLimitInfo: ratelimiter.getInfo(),
    };

    response.set({
        "x-ratelimit-limit": request.body.rateLimitInfo.limit,
        "x-ratelimit-remaining": request.body.rateLimitInfo.remaining,
        "x-ratelimit-reset": request.body.rateLimitInfo.reset,
    });

    if (!isAllowed)
        return response.status(HTTPCodes.TOO_MANY_REQUEST).json({
            message: "You're reach your limit, please try again later.",
        });

    return next();
}
