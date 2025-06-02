import { Router } from "express";
import { chatResourceLimit } from "@/middlewares/rate-limiter.middleware";
import { fixedWindow } from "@/controllers/ratelimit.controller";

const rateLimitRoutes = Router();

rateLimitRoutes
    .route("/counter/fixed-window")
    .post(chatResourceLimit, fixedWindow);


export default rateLimitRoutes;
