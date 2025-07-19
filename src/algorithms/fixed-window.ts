import { Limit, TimeLimit } from "@/enum/limiter.enum";
import { Algorithm, FixedWindow as FixedWindowType } from "@/types/rate-limit";
import moment from "moment";
import BaseAlgo from "./base-algo";

export default class FixedWindow extends BaseAlgo implements Algorithm {
    async isAllowed(key: string) {
        const getCache = await this.cache.get(key);

        const redisData = getCache
            ? (JSON.parse(getCache) as FixedWindowType)
            : { count: 0, timestamp: new Date() };

        const timeDiff = moment().diff(redisData.timestamp, "seconds");
        const isTimeOverlap = this.timeLimit <= timeDiff;

        const count = isTimeOverlap ? 1 : redisData.count + 1;
        const timestamp = isTimeOverlap ? new Date() : redisData.timestamp;

        const reachLimit = redisData.count >= this.limit;
        const withinTimeLimit = this.timeLimit >= timeDiff;

        this.remaining = reachLimit && withinTimeLimit ? 0 : this.limit - count;
        this.reset = isTimeOverlap ? this.timeLimit : this.timeLimit - timeDiff;

        if (reachLimit && withinTimeLimit) return false;

        await this.cache.set(
            key,
            JSON.stringify({
                count,
                timestamp,
            }),
        );

        return true;
    }

    getInfo() {
        return {
            reset: this.reset,
            remaining: this.remaining,
            limit: this.limit,
        };
    }

    setLimit(limit: Limit) {
        this.limit = limit;
    }

    setTimeLimit(timeLimit: TimeLimit) {
        this.timeLimit = timeLimit;
    }
}
