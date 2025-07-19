import { redisClient } from "@/config/redis.connection";
import { Limit, TimeLimit } from "@/enum/limiter.enum";
import { Algorithm as AlgorithmType } from "@/types/rate-limit";

export default abstract class Algorithm implements AlgorithmType {
    protected limit: Limit = Limit.NORMAL;
    protected timeLimit: TimeLimit = TimeLimit.MINUTE;
    protected remaining: number = this.limit;
    protected reset: number = this.timeLimit;
    protected cache;

    protected abstract readonly prefix: string;

    abstract isAllowed(key: string): Promise<boolean>;

    constructor() {
        this.cache = redisClient;
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
