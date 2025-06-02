import HTTPCodes from "@/constant/http-codes";
import { RequestHandlerError } from "./request-handler.error";

export class NotFoundError extends RequestHandlerError {
    statusCode: number = HTTPCodes.NotFound;
    errorMessage: string;

    constructor(message: string) {
        super(message);
        this.name = "NotFound";
        this.errorMessage = message;
    }
}
