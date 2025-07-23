import { mockRedis, redisData } from "../__mocks__/function.mock";
jest.mock("../src/config/redis.connection", () => mockRedis());

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

describe("fixed window v2 algorithm", () => {
    const clientId = "fw-fkdlsefilese";

    it("should return 200", async () =>
        request(app).post("/api/v2/counter/fixed-window").expect(200));

    it("should return 200 with request header set", async () =>
        request(app)
            .post("/api/v2/counter/fixed-window")
            .set({
                "x-client-id": clientId,
                "x-ratelimit-window": "HOUR",
                "x-ratelimit-limit": "STRICT",
            })
            .expect(200));

    it("should return 400 bad request for param header", async () => {
        await request(app)
            .post("/api/v2/counter/fixed-window")
            .set({
                "x-client-id": clientId,
                "x-ratelimit-window": "HOURS",
            })
            .expect(400);

        await request(app)
            .post("/api/v2/counter/fixed-window")
            .set({
                "x-client-id": clientId,
                "x-ratelimit-limit": "UNKNOWN",
            })
            .expect(400);
    });

    it("should return 429 too many request", async () => {
        const res = await Promise.all(
            new Array(11).fill(null).map(() =>
                request(app).post("/api/v2/counter/fixed-window").set({
                    "x-client-id": clientId,
                }),
            ),
        );

        expect(res[10].statusCode).toBe(429);
    });
});

describe("sliding window log v2 algorithm", () => {
    const clientId = "swl-fkdlsefilese";

    it("should return 200", async () =>
        request(app).post("/api/v2/sliding-window-log").expect(200));

    it("should return 200 with request header set", async () =>
        request(app)
            .post("/api/v2/sliding-window-log")
            .set({
                "x-client-id": clientId,
                "x-ratelimit-window": "HOUR",
                "x-ratelimit-limit": "STRICT",
            })
            .expect(200));

    it("should return 400 bad request for param header", async () => {
        await request(app)
            .post("/api/v2/sliding-window-log")
            .set({
                "x-client-id": clientId,
                "x-ratelimit-window": "HOURS",
            })
            .expect(400);

        await request(app)
            .post("/api/v2/sliding-window-log")
            .set({
                "x-client-id": clientId,
                "x-ratelimit-limit": "ADMIN",
            })
            .expect(400);
    });

    it("should return 429 too many request", async () => {
        const res = await Promise.all(
            new Array(11).fill(null).map(() =>
                request(app).post("/api/v2/sliding-window-log").set({
                    "x-client-id": clientId,
                }),
            ),
        );

        expect(res[10].statusCode).toBe(429);
    });
});

describe("sliding window counter v2 algorithm", () => {
    const clientId = "swc-fkdlsefilese";

    it("should return 200", async () =>
        request(app).post("/api/v2/counter/sliding-window").expect(200));

    it("should return 200 with request header set", async () =>
        request(app)
            .post("/api/v2/counter/sliding-window")
            .set({
                "x-client-id": clientId,
                "x-ratelimit-window": "HOUR",
                "x-ratelimit-limit": "STRICT",
            })
            .expect(200));

    it("should return 400 bad request for param header", async () => {
        await request(app)
            .post("/api/v2/counter/sliding-window")
            .set({
                "x-client-id": clientId,
                "x-ratelimit-window": "HOURS",
            })
            .expect(400);

        await request(app)
            .post("/api/v2/counter/sliding-window")
            .set({
                "x-client-id": clientId,
                "x-ratelimit-limit": "ADMIN",
            })
            .expect(400);
    });

    it("should return 429 too many request", async () => {
        const res = await Promise.all(
            new Array(11)
                .fill(null)
                .map(() => request(app).post("/api/v2/counter/sliding-window")),
        );

        expect(res[10].statusCode).toBe(429);
    });
});
