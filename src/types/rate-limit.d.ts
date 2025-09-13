import { Limit, TimeLimit } from "@/enum/limiter.enum";

export interface FixedWindow {
    count: number;
    timestamp: Date;
}

export interface TokenBucket {
    tokens: number;
    lastRefill: Date;
}

export type SlidingLog = Date[];

export type SlidingCounter = {
    [string]: number;
};
export interface Algorithm {
    isAllowed: (key: string) => Promise<boolean>;
    setLimit: (limit: Limit) => void;
    setTimeLimit: (timeLimit: TimeLimit) => void;
    getInfo: () => void;
}

export type LimitKey = keyof typeof Limit;

export type TimeLimitKey = keyof typeof TimeLimit;
