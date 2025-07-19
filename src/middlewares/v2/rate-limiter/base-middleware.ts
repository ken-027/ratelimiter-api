import { Limit, TimeLimit } from "@/enum/limiter.enum";
import { BadRequestError } from "@/errors/bad-request.error";
import { TooManyRequest } from "@/errors/too-many-request.error";
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

    abstract factoryClass(): Algorithm;

    constructor(
        private request: Request,
        private response: Response,
    ) {
        this.ratelimiter = this.factoryClass();
    }

    validateTimeLimit(): void {
        if (this.timeLimitConfig) {
            const keyTimeLimit = this.timeLimitConfig.toUpperCase();

            if (!this.availableTimeLimit.includes(keyTimeLimit as never))
                throw new BadRequestError(
                    `Available options are ${this.availableTimeLimit.join(", ")} for header '${this.timeLimitHeaderName}'`,
                );

            this.ratelimiter.setTimeLimit(
                TimeLimit[keyTimeLimit as TimeLimitKey],
            );
        }
    }

    validateLimit(): void {
        if (this.limitConfig) {
            const keyLimit = this.limitConfig.toUpperCase();

            if (!this.availableLimit.includes(keyLimit as never))
                throw new BadRequestError(
                    `Available options are ${this.availableLimit.join(", ")} for header '${this.limitHeaderName}'`,
                );

            this.ratelimiter.setLimit(Limit[keyLimit as LimitKey]);
        }
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
            throw new TooManyRequest(
                "You're reach your limit, please try again later",
            );
    }
}
