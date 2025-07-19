import { NextFunction, Request, Response } from "express";
import BaseMiddleware from "./rate-limiter/base-middleware";
import FixedWindowMiddleware from "./rate-limiter/fixed-window";
import SlidingLogMiddleware from "./rate-limiter/sliding-log";

export async function fixedWindowMiddleware(
    request: Request,
    response: Response,
    next: NextFunction,
) {
    const fixedWindowMiddleware: BaseMiddleware = new FixedWindowMiddleware(
        request,
        response,
    );

    await fixedWindowMiddleware.process();

    return next();
}

export async function slidingLogMiddleware(
    request: Request,
    response: Response,
    next: NextFunction,
) {
    const slidingLogMiddleware: BaseMiddleware = new SlidingLogMiddleware(
        request,
        response,
    );

    await slidingLogMiddleware.process();

    return next();
}
