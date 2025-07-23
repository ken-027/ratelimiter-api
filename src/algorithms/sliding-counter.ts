import Algorithm from "./algorithm";
import moment from "moment";

export default class SlidingCounter extends Algorithm {
    protected readonly prefix = "swc";
    private subWindowSize: number = 4;

    setSubWindowSize(size: number) {
        this.subWindowSize = size;
    }

    private getItemToDeleteAndAvailable(
        timestamp: string[],
        data: Record<string, string>,
    ) {
        const timestampToDelete = [];
        const timestampAvailable = [];
        let limit = 1;

        for (const key in timestamp) {
            if (
                moment().diff(timestamp[key].split("--")[0], "seconds") >
                this.timeLimit
            ) {
                timestampToDelete.push(timestamp[key]);
                continue;
            }

            limit += parseInt(data[timestamp[key]]);
            timestampAvailable.push(timestamp[key]);
        }

        return {
            timestampAvailable,
            timestampToDelete,
            limit,
        };
    }

    private getTimeEnd(timestamp: string[]) {
        const now = new Date();

        const lastItem = timestamp.length - 1;
        const lastKey = timestamp[lastItem]?.split("--");

        const timeIncrementor = Math.ceil(this.timeLimit / this.subWindowSize);
        const timeEnd = moment(now)
            .add(timeIncrementor - 1, "seconds")
            .toISOString();

        const isInCurrent =
            lastKey && moment(lastKey[1]).diff(now, "seconds") > 0;

        const fromTime = isInCurrent ? lastKey[0] : now.toISOString();
        const toTime = isInCurrent ? lastKey[1] : timeEnd;

        return {
            fromTime,
            toTime,
        };
    }

    async isAllowed(key: string) {
        const prefixKey = `${this.prefix}-${key}`;
        const now = new Date();

        const getCache = await this.cache.hGetAll(prefixKey);
        const timestamps = Object.keys(getCache);

        const { fromTime, toTime } = this.getTimeEnd(timestamps);
        const { timestampAvailable, timestampToDelete, limit } =
            this.getItemToDeleteAndAvailable(timestamps, getCache);

        await Promise.all(
            timestampToDelete.map((item) => this.cache.hDel(prefixKey, item)),
        );

        const limitReach = limit > this.limit;
        const latestTime = timestampAvailable.length
            ? timestampAvailable[0].split("--")[0]
            : now;

        this.remaining = limitReach ? 0 : this.limit - limit;
        this.reset = this.timeLimit - moment().diff(latestTime, "seconds");

        if (limitReach) return false;

        await this.cache.hIncrBy(prefixKey, `${fromTime}--${toTime}`, 1);
        await this.cache.expire(prefixKey, this.timeLimit);

        return true;
    }
}
