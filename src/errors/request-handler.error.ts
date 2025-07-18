import HTTPCodes from "@/enum/http-codes.enum";

export interface IRequestHandlerError {
    statusCode: number;
    statusMessage: string;
    errorMessage: string;
}

export class RequestHandlerError extends Error {
    statusCode: number = HTTPCodes.INTERNAL_SERVER_ERROR;
    errorMessage: string;

    constructor(message: string) {
        super(message);
        this.name = "BadRequest";
        this.errorMessage = message;
    }
}
