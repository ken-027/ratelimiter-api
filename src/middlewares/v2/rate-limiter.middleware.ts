import { NextFunction, Request, Response } from "express";
import BaseMiddleware from "./rate-limiter/base-middleware";
import FixedWindowMiddleware from "./rate-limiter/fixed-window";
import SlidingLogMiddleware from "./rate-limiter/sliding-log";
import SlidingCounterMiddleware from "./rate-limiter/sliding-counter";
import TokenBucketMiddleware from "./rate-limiter/token-bucket";

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

export async function slidingCounterMiddleware(
    request: Request,
    response: Response,
    next: NextFunction,
) {
    const slidingCounterMiddleware: BaseMiddleware =
        new SlidingCounterMiddleware(request, response);

    await slidingCounterMiddleware.process();

    return next();
}

export async function tokenBucketMiddleware(
    request: Request,
    response: Response,
    next: NextFunction,
) {
    const tokenBucketMiddleware: BaseMiddleware = new TokenBucketMiddleware(
        request,
        response,
    );


    await tokenBucketMiddleware.process();

    return next();
}
