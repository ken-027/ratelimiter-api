import express from "express";

import "express-async-errors";
import errorHandler from "@/middlewares/error-handler.middleware";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import NotFound from "@/middlewares/not-found.middleware";
import cors from "cors";
import { ALLOWED_ORIGINS, PRODUCTION, SESSION_SECRET } from "@/config/env";
// import helmet from "helmet";
// import morgan from "morgan";
// import logger from "@/middlewares/logger.middleware";
import passport from "passport";
import fs from "fs";
import path from "path";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "@/config/db.connection";

// import swaggerUI from "swagger-ui-express";
import swaggerSpec from "./swagger";
import rateLimitRoutes from "./routes/v1/ratelimit.route";

const prefixRoute = "/api/v1";

export const app = express();

const sessionStore = connectPgSimple(session);

app.set("trust proxy", true);
app.use(
    session({
        store: new sessionStore({
            pool,
            tableName: "chat_sessions",
            createTableIfMissing: true,
            pruneSessionInterval: 60 * 60, // 1 hour
        }),
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: PRODUCTION, maxAge: 60 * 60 * 1000 }, // 1 hours
    }),
);
// app.use(helmet());
app.use(express.static(path.join(__dirname, "../public")));
// app.use(

//     morgan(NODE_ENV === "production" ? "combined" : "dev", {
//         stream: logger(),
//     }),
// );

// app.use(
//     "/api-docs",
//     swaggerUI.serve,
//     swaggerUI.setup(
//         PRODUCTION
//             ? JSON.parse(
//                   fs.readFileSync(
//                       path.join(__dirname, "./swagger.json"),
//                       "utf-8",
//                   ),
//               )
//             : swaggerSpec,
//         {
//             customSiteTitle: `Portfolio API Documentation`,
//             customCss: ".swagger-ui .topbar { display: none }",
//         },
//     ),
// );

app.use(
    "/swagger-ui",
    express.static(path.join(__dirname, "node_modules", "swagger-ui-dist")),
);

app.get("/swagger.json", (_req, res) => {
    res.json(
        PRODUCTION
            ? JSON.parse(
                  fs.readFileSync(
                      path.join(__dirname, "./swagger.json"),
                      "utf-8",
                  ),
              )
            : swaggerSpec,
    );
});

app.get("/api-docs", (_req, res) => {
    res.sendFile(path.join(__dirname, "./templates/swagger.html"));
});
app.use("/api", cors({ origin: ALLOWED_ORIGINS, credentials: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(cookieParser());

app.use(`${prefixRoute}`, rateLimitRoutes);

app.all("*", NotFound);
app.use(errorHandler);

export default app;
