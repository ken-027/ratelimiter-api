import { FixedWindow as FixedWindowType } from "@/types/rate-limit";
import moment from "moment";
import Algorithm from "./algorithm";

export default class FixedWindow extends Algorithm {
    protected readonly prefix = "fw";

    async isAllowed(key: string) {
        const prefixKey = `${this.prefix}-${key}`;
        const getCache = await this.cache.get(prefixKey);
        const now = new Date();

        const redisData = getCache
            ? (JSON.parse(getCache) as FixedWindowType)
            : { count: 0, timestamp: now };

        const timeDiff = moment().diff(redisData.timestamp, "seconds");
        const isTimeOverlap = this.timeLimit <= timeDiff;

        const count = isTimeOverlap ? 1 : redisData.count + 1;
        const timestamp = isTimeOverlap ? now : redisData.timestamp;

        const reachLimit = redisData.count >= this.limit;
        const withinTimeLimit = this.timeLimit >= timeDiff;

        this.remaining = reachLimit && withinTimeLimit ? 0 : this.limit - count;
        this.reset = isTimeOverlap ? this.timeLimit : this.timeLimit - timeDiff;

        if (reachLimit && withinTimeLimit) return false;

        await this.cache.set(
            prefixKey,
            JSON.stringify({
                count,
                timestamp,
            }),
        );

        return true;
    }
}
