import Algorithm from "./algorithm";
import { SlidingLog as SlidingLogType } from "@/types/rate-limit";
import moment from "moment";

export default class SlidingLog extends Algorithm {
    protected readonly prefix = "swl";

    async isAllowed(key: string) {
        const prefixKey = `${this.prefix}-${key}`;
        const now = new Date();

        const redisData = await this.getCache(prefixKey);

        const logs = redisData.filter(
            (date) => moment().diff(date, "seconds") <= this.timeLimit,
        );

        logs.push(now);

        const totalLog = logs.length;
        const limitReach = totalLog > this.limit;

        this.remaining = limitReach ? 0 : this.limit - totalLog;
        this.reset = this.timeLimit - moment().diff(logs[0], "seconds");

        if (limitReach) return false;

        await this.saveCache(prefixKey, logs);

        return true;
    }

    private async getCache(key: string): Promise<SlidingLogType> {
        const getCache = await this.cache.get(key);
        return getCache ? (JSON.parse(getCache) as SlidingLogType) : [];
    }

    private async saveCache(key: string, logs: SlidingLogType): Promise<void> {
        await this.cache.set(key, JSON.stringify(logs), {
            EX: this.timeLimit,
        });
    }
}
