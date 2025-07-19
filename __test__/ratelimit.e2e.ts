/* eslint-disable @typescript-eslint/no-explicit-any */

// eslint-disable-next-line @typescript-eslint/no-require-imports
// jest.mock("redis", () => require("redis-mock"));
const redisData = new Map<string, any>();

jest.mock("../src/config/redis.connection", () => {
    return {
        redisClient: {
            get: jest.fn(async (key: string) => redisData.get(key) || null),
            set: jest.fn(async (key: string, value: string) => {
                redisData.set(key, value);
                return "OK";
            }),
        },
    };
});

import request from "supertest";
import { Express } from "express";
import createApp from "../src/app";

let app: Express;

beforeAll(async () => {
    app = createApp;
});

afterEach(async () => {
    redisData.clear();
});

afterAll(async () => {
    jest.clearAllTimers();
});

describe("fixed window v1 algorithm", () => {
    it("should access fixed window algo", async () => {
        const res = await request(app).post("/api/v1/counter/fixed-window");

        expect(res.statusCode).toBe(200);
        expect(res.body.access).toBe("granted");
    });

    it("should access fixed window algo for deep research", async () => {
        const res = await request(app).post(
            "/api/v1/counter/fixed-window/deep-research",
        );

        expect(res.statusCode).toBe(200);
        expect(res.body.access).toBe("granted");
    });
});

describe("fixed window v2 algorithm", () => {
    it("should return 200", async () => {
        return request(app).post("/api/v2/counter/fixed-window").expect(200);
    });

    it("should return 429 too many request", async () => {
        const res = await Promise.all(
            new Array(11)
                .fill(null)
                .map(() => request(app).post("/api/v2/counter/fixed-window")),
        );

        expect(res[10].statusCode).toBe(429);
    });
});

describe("sliding window log v2 algorithm", () => {
    it("should return 200", async () => {
        return request(app).post("/api/v2/sliding-window-log").expect(200);
    });

    it("should return 429 too many request", async () => {
        const res = await Promise.all(
            new Array(11)
                .fill(null)
                .map(() => request(app).post("/api/v2/sliding-window-log")),
        );

        expect(res[10].statusCode).toBe(429);
    });
});
