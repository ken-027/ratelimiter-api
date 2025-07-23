/* eslint-disable @typescript-eslint/no-explicit-any */

import request from "supertest";
import { Express } from "express";
import createApp from "../src/app";

let app: Express;

beforeAll(async () => {
    app = createApp;
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
