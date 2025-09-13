import { Router } from "express";
import {
    algorithmList,
    ratelimitResponse,
} from "@/controllers/v2/ratelimit.controller";
import {
    fixedWindowMiddleware,
    slidingCounterMiddleware,
    slidingLogMiddleware,
    tokenBucketMiddleware,
} from "@/middlewares/v2/rate-limiter.middleware";

const rateLimitRoutesV2 = Router();

rateLimitRoutesV2
    .route("/counter/fixed-window")
    .post(fixedWindowMiddleware, ratelimitResponse);
rateLimitRoutesV2
    .route("/counter/sliding-window")
    .post(slidingCounterMiddleware, ratelimitResponse);
rateLimitRoutesV2.route("/bucket/token").post(tokenBucketMiddleware, ratelimitResponse);
rateLimitRoutesV2.route("/bucket/leaky").post(ratelimitResponse);
rateLimitRoutesV2
    .route("/sliding-window-log")
    .post(slidingLogMiddleware, ratelimitResponse);

rateLimitRoutesV2.route("/").get(algorithmList);

export default rateLimitRoutesV2;
