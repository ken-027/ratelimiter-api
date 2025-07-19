import { redisClient } from "@/config/redis.connection";
import { Limit, TimeLimit } from "@/enum/limiter.enum";

export default abstract class BaseAlgo {
    protected limit: Limit = Limit.NORMAL;
    protected timeLimit: TimeLimit = TimeLimit.MINUTE;
    protected remaining: number = this.limit;
    protected reset: number = this.timeLimit;
    protected cache;

    constructor() {
        this.cache = redisClient;
    }
}
