import HTTPCodes from "@/constant/http-codes";
import { RequestHandlerError } from "./request-handler.error";

export class UnAuthorizedError extends RequestHandlerError {
    statusCode: number = HTTPCodes.Unauthorized;
    errorMessage: string;

    constructor(message: string) {
        super(message);
        this.name = "UnAuthorized";
        this.errorMessage = message;
    }
}
