import { NODE_ENV } from "@/config/env";
import HTTPCodes from "@/constant/http-codes";
import { RequestHandlerError } from "@/errors/request-handler.error";
import { devLog } from "@/utils/logger.util";
import { AxiosError } from "axios";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export default function errorHandler(
    error: Error,
    _req: Request,
    res: Response,
    _next: NextFunction,
) {
    if (error instanceof RequestHandlerError) {
        handleRequestHandlerError(error, res);
    } else if (error instanceof AxiosError) {
        handleAxiosError(error, res);
    } else if (error instanceof ZodError) {
        handleZodError(error, res);
    } else {
        handleGenericError(error, res);
    }
}

const sendErrorResponse = (
    res: Response,
    status: number,
    errorObj: unknown,
) => {
    res.status(status).json(errorObj);
};

const handleRequestHandlerError = (
    error: RequestHandlerError,
    res: Response,
) => {
    sendErrorResponse(res, error.statusCode, {
        error: error.errorMessage,
    });
};

const handleGenericError = (error: Error, res: Response) => {
    const { message, stack, name } = error;

    const errorObj = {
        name,
        message,
        stack,
    };

    if (NODE_ENV === "production") {
        sendErrorResponse(res, HTTPCodes.InternalServerError, {
            error: "Internal Server Error",
        });
        console.error(errorObj);
    } else {
        sendErrorResponse(res, HTTPCodes.InternalServerError, errorObj);
    }
};

const handleAxiosError = (error: AxiosError, res: Response) => {
    devLog(error);
    sendErrorResponse(
        res,
        Number.isInteger(error?.code)
            ? (error.code as never)
            : HTTPCodes.InternalServerError,
        {
            name: error.name,
            url: error.config?.url,
            message: error.response?.data,
        },
    );
};

const handleZodError = (error: ZodError, res: Response) => {
    sendErrorResponse(res, HTTPCodes.BadRequest, error.issues);
};
