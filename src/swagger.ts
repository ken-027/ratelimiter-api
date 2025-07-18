// @ts-expect-error @ts-ignore
import swaggerJSDoc from "swagger-jsdoc";

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
