import HTTPCodes from "@/enum/http-codes.enum";
import { RequestHandlerError } from "./request-handler.error";

export class BadRequestError extends RequestHandlerError {
    statusCode: number = HTTPCodes.BAD_REQUEST;
    errorMessage: string;

    constructor(message: string) {
        super(message);
        this.name = "BAD_REQUEST";
        this.errorMessage = message;
    }
}
