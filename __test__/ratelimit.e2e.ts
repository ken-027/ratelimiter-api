import request from "supertest";
import { Express } from "express";
import createApp from "../src/app";

describe("fixed window v1 algorithm", () => {
    let app: Express;

    beforeAll(() => {
        app = createApp;
    });

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

// describe("fixed window v2 algorithm", () => {
//     let app: Express;

//     beforeAll(() => {
//         app = createApp;
//     });

//     it("should access fixed window algo", async () => {
//         const res = await request(app).post("/api/v2/counter/fixed-window");

//         console.log(res.body);

//         expect(res.statusCode).toBe(200);
//         expect(res.body.access).toBe("granted");
//     });
// });
