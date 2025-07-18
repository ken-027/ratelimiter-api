import { Request } from "express";

export default function getIP(request: Request) {
    return (
        (request.headers["custom-header"] as string) ||
        request.headers["cf-connecting-ip"]?.toString().split(",")[0].trim() ||
        request.headers["x-forwarded-for"]?.toString().split(",")[0].trim() ||
        request.socket.remoteAddress ||
        "unknown"
    );
}

export const getClientId = (request: Request) =>
    request.headers["x-client-id"]?.toString() ||
    request.headers["cf-connecting-ip"]?.toString().split(",")[0].trim() ||
    request.headers["x-forwarded-for"]?.toString().split(",")[0].trim() ||
    request.socket.remoteAddress ||
    "unknown";
