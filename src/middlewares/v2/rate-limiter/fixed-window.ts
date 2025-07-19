import { BadRequestError } from "@/errors/bad-request.error";
import BaseMiddleware from "./base-middleware";
import { Limit, TimeLimit } from "@/enum/limiter.enum";
import { Algorithm, LimitKey, TimeLimitKey } from "@/types/rate-limit";
import FixedWindow from "@/algorithms/fixed-window";

export default class FixedWindowMiddleware extends BaseMiddleware {
    validateTimeLimit(): void {
        if (this.timeLimitConfig) {
            const keyTimeLimit = this.timeLimitConfig.toUpperCase();

            if (!this.availableTimeLimit.includes(keyTimeLimit as never))
                throw new BadRequestError(
                    `Available options are ${this.availableTimeLimit.join(", ")} for header '${this.timeLimitHeaderName}'`,
                );

            this.ratelimiter.setTimeLimit(TimeLimit[keyTimeLimit as TimeLimitKey]);
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

    factoryClass(): Algorithm {
        return new FixedWindow();
    }
}
