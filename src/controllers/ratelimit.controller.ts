import { Request, Response } from "express";

/**
 * @swagger
 * /api/v1/counter/fixed-window:
 *   post:
 *     summary: fixed window counter algorithm v1
 *     tags:
 *       - Ratelimit V1
 *     responses:
 *       200:
 *         description: Platforms list with rate-limit metadata
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
export async function slidingWindow(
    _request: Request<never, unknown>,
    response: Response,
) {
    response.json({ access: "granted" });
}

/**
 * @swagger
 * /api/v1/counter/fixed-window/deep-research:
 *   post:
 *     summary: fixed window counter algorithm v1 for Deep Research Application
 *     tags:
 *       - Ratelimit V1
 *     parameters:
 *       - in: header
 *         name: custom-header
 *         schema:
 *           type: string
 *         required: false
 *         description: setting key for its limit
 *     responses:
 *       200:
 *         description: Platforms list with rate-limit metadata
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
