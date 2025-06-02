import request from "supertest";
import { Express } from "express";
import createApp from "../src/app";

describe("/api/v1/counter/fixed-window", () => {
    let app: Express;

    beforeAll(() => {
        app = createApp;
    });

    it("should access fixed window algo", async () => {
        const res = await request(app).post("/api/v1/counter/fixed-window");

        expect(res.statusCode).toBe(201);
        expect(res.body.access).toBe("granted");
    });
});
