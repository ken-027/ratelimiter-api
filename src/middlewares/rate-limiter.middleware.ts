import rateLimitPackage from "express-rate-limit";
import { PRODUCTION } from "../config/env";
import { RedisStore } from "rate-limit-redis";
import { redisClient } from "@/config/redis.connection";

const rateLimit = rateLimitPackage({
    windowMs: 60 * 1000, // per minute
    limit: 50,
    standardHeaders: true,
    legacyHeaders: false,
});

export const resourceLimit = rateLimitPackage({
    windowMs: 60 * 1000, // per minute
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
});

export const modifyResourceLimit = rateLimitPackage({
    windowMs: 60 * 1000, // per minute
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
});

export const slidingWindow = rateLimitPackage({
    windowMs: 1000 * 60 * 60 * 24, // 24 hours
    limit: PRODUCTION ? 10 : 2,
    standardHeaders: true,
    legacyHeaders: false,
    skipFailedRequests: true,
    store: PRODUCTION
        ? new RedisStore({
              sendCommand: (...args: string[]) => redisClient.sendCommand(args),
          })
        : undefined,
    keyGenerator: (req) =>
        (req.headers["custom-header"] as string) || req.ip || "unknown",
});

export const slidingWindowForDeepResearch = rateLimitPackage({
    windowMs: 1000 * 60 * 60 * 24, // 24 hours
    limit: 2,
    standardHeaders: true,
    legacyHeaders: false,
    skipFailedRequests: true,
    store: PRODUCTION
        ? new RedisStore({
              sendCommand: (...args: string[]) => redisClient.sendCommand(args),
          })
        : undefined,
    keyGenerator: (req) =>
        (req.headers["custom-header"] as string) || req.ip || "unknown",
});

export const scriptResourceLimit = rateLimitPackage({
    windowMs: 1000 * 60 * 60 * 24, // 24 hours
    limit: PRODUCTION ? 5 : 100,
    standardHeaders: true,
    legacyHeaders: false,
    store: PRODUCTION
        ? new RedisStore({
              sendCommand: (...args: string[]) => redisClient.sendCommand(args),
          })
        : undefined,
});

export const emailResourceLimit = rateLimitPackage({
    windowMs: 1000 * 60 * 60 * 24, // 24 hours
    limit: 3,
    standardHeaders: true,
    legacyHeaders: false,
    store: PRODUCTION
        ? new RedisStore({
              sendCommand: (...args: string[]) => redisClient.sendCommand(args),
          })
        : undefined,
    message: {
        message:
            "⚠️ Email request limit reached for today. Please try again tomorrow",
    },
});

export default rateLimit;
