import HTTPCodes from "@/enum/http-codes.enum";
import { RequestHandlerError } from "./request-handler.error";

export class TooManyRequest extends RequestHandlerError {
    statusCode: number = HTTPCodes.TOO_MANY_REQUEST;
    errorMessage: string;

    constructor(message: string) {
        super(message);
        this.name = "TOO_MANY_REQUEST";
        this.errorMessage = message;
    }
}
