import HTTPCodes from "@/constant/http-codes";
import { RequestHandlerError } from "./request-handler.error";

export class BadRequestError extends RequestHandlerError {
    statusCode: number = HTTPCodes.BadRequest;
    errorMessage: string;

    constructor(message: string) {
        super(message);
        this.name = "BadRequest";
        this.errorMessage = message;
    }
}
