import chalk from "chalk";
import { PORT } from "@/config/env";
import {
    initializeRedisConnection,
    redisClient,
} from "./config/redis.connection";

initializeRedisConnection();

import app from "./app";

app.listen(PORT, () => {
    console.log(chalk.bgYellow(" listening on port: "), chalk.yellow(PORT));
});

process.on("SIGINT", async () => {
    await redisClient.destroy();
    console.log("redis destroy");
});
