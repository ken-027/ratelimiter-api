import Algorithm from "./algorithm";
import { SlidingLog as SlidingLogType } from "@/types/rate-limit";
import moment from "moment";

export default class SlidingLog extends Algorithm {
    protected readonly prefix = "swl";

    nextReset(logs: SlidingLogType) {
        const oldestRequest = logs[0];
        const expiresAt =
            moment().diff(oldestRequest, "seconds") + this.timeLimit;
        return Math.max(0, expiresAt - Date.now());
    }

    async isAllowed(key: string) {
        const prefixKey = `${this.prefix}-${key}`;
        const getCache = await this.cache.get(prefixKey);
        const now = new Date();

        const redisData = getCache
            ? (JSON.parse(getCache) as SlidingLogType)
            : [];

        const logs = redisData.filter(
            (date) => moment().diff(date, "seconds") <= this.timeLimit,
        );

        logs.push(now);

        const totalLog = logs.length;
        const limitReach = totalLog > this.limit;

        this.remaining = limitReach ? 0 : this.limit - totalLog;
        this.reset = this.timeLimit - moment().diff(logs[0], "seconds");

        if (limitReach) return false;

        await this.cache.set(prefixKey, JSON.stringify(logs));

        return true;
    }
}
