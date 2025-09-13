import moment from "moment";
import Algorithm from "./algorithm";
import { TokenBucket as TokenBucketType } from "@/types/rate-limit";

export default class TokenBucket extends Algorithm {
    protected readonly prefix: string = "tb";

    async isAllowed(key: string): Promise<boolean> {
        const prefixKey = `${this.prefix}-${key}`;
        const now = new Date();

        const bucket: TokenBucketType = await this.getCache(prefixKey);

        const { elapseTime, tokenToAdd } = this.getDetails(bucket);

        bucket.lastRefill = now;
        bucket.tokens = Math.min(
            this.limit,
            Number((bucket.tokens + tokenToAdd).toFixed(2)),
        );

        if (bucket.tokens < 1) {
            this.remaining = 0;
            this.reset = Math.max(0, Math.floor(this.timeLimit - elapseTime));
            return false;
        }

        bucket.tokens -= 1;
        this.remaining = Math.floor(bucket.tokens);
        this.reset = Math.max(0, Math.floor(this.timeLimit - elapseTime));

        await this.saveCache(prefixKey, bucket);

        return true;
    }

    private getDetails(bucket: TokenBucketType) {
        const tokenRate = Number((this.limit / this.timeLimit).toFixed(2));
        const elapseTime =
            moment().diff(bucket.lastRefill, "milliseconds") / 1000;
        const tokenToAdd = Number((elapseTime * tokenRate).toFixed(2));

        return { elapseTime, tokenToAdd };
    }

    private async saveCache(
        key: string,
        bucket: TokenBucketType,
    ): Promise<void> {
        this.cache.set(key, JSON.stringify(bucket), {
            EX: this.timeLimit,
        });
    }

    private async getCache(key: string): Promise<TokenBucketType> {
        const now = new Date();
        const getCache = await this.cache.get(key);

        return getCache
            ? JSON.parse(getCache)
            : { tokens: this.limit, lastRefill: now };
    }
}
