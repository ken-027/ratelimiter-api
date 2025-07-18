// @ts-expect-error @ts-ignore
import swaggerJSDoc from "swagger-jsdoc";
import path from "path";
import fs from "fs";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Ratelimiter API",
            version: "1.0.0",
            description: "API Documentation",
        },
    },
    apis: ["./src/controllers/**/*.ts", "./src/middlewares/**/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;

const outputPath = path.resolve("./build/swagger.json");
fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2));
