import { Router } from "express";
import {
    slidingWindow,
    slidingWindowForDeepResearch,
} from "@/middlewares/rate-limiter.middleware";
import { slidingWindow as slidingWindowController } from "@/controllers/ratelimit.controller";

const rateLimitRoutes = Router();

rateLimitRoutes.route("/counter/fixed-window").post(slidingWindow, slidingWindowController);
rateLimitRoutes
    .route("/counter/fixed-window/deep-research")
    .post(slidingWindowForDeepResearch, slidingWindowController);

export default rateLimitRoutes;
