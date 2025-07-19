import HTTPCodes from "@/enum/http-codes.enum";
import { Algorithm, LimitKey, TimeLimitKey } from "@/types/rate-limit";
import { getClientId } from "@/utils/getIP.util";
import { Request, Response } from "express";

export default abstract class BaseMiddleware {
    protected availableTimeLimit: TimeLimitKey[] = [
        "DAY",
        "HOUR",
        "MINUTE",
        "MONTH",
        "SECOND",
        "WEEK",
        "YEAR",
    ];

    protected availableLimit: LimitKey[] = [
        "ADMIN",
        "BURSTY",
        "NORMAL",
        "PREMIUM",
        "STRICT",
    ];
    protected timeLimitConfig: string | undefined;
    protected limitConfig: string | undefined;
    protected readonly limitHeaderName = "x-ratelimit-limit";
    protected readonly timeLimitHeaderName = "x-ratelimit-window";
    protected readonly ratelimiter: Algorithm;

    abstract validateLimit(): void;
    abstract validateTimeLimit(): void;
    abstract factoryClass(): Algorithm;

    constructor(
        private request: Request,
        private response: Response,
    ) {
        this.ratelimiter = this.factoryClass();
    }

    async process() {
        const clientId = getClientId(this.request);

        this.timeLimitConfig =
            this.request.headers[this.timeLimitHeaderName]?.toString();
        this.limitConfig =
            this.request.headers[this.limitHeaderName]?.toString();

        this.validateTimeLimit();
        this.validateLimit();

        const isAllowed = await this.ratelimiter.isAllowed(clientId);

        this.request.body = {
            rateLimitInfo: this.ratelimiter.getInfo(),
        };

        this.response.set({
            "x-ratelimit-limit": this.request.body.rateLimitInfo.limit,
            "x-ratelimit-remaining": this.request.body.rateLimitInfo.remaining,
            "x-ratelimit-reset": this.request.body.rateLimitInfo.reset,
        });

        if (!isAllowed)
            return this.response.status(HTTPCodes.TOO_MANY_REQUEST).json({
                message: "You're reach your limit, please try again later.",
            });
    }
}
