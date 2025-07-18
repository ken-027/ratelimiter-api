import HTTPCodes from "@/enum/http-codes.enum";
import { RequestHandlerError } from "./request-handler.error";

export class UnAuthorizedError extends RequestHandlerError {
    statusCode: number = HTTPCodes.UNAUTHORIZE;
    errorMessage: string;

    constructor(message: string) {
        super(message);
        this.name = "UnAuthorized";
        this.errorMessage = message;
    }
}
