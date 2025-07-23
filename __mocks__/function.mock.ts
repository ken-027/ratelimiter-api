/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";

export const mockRequest = {} as Request;
export const redisData = new Map<string, any>();

export const mockResponse = {
    json: jest.fn(),
} as unknown as Response;

export const mockRedis = () => {
    return {
        redisClient: {
            get: jest.fn(async (key: string) => redisData.get(key) || null),
            set: jest.fn(async (key: string, value: string) => {
                redisData.set(key, value);
                return "OK";
            }),
            hIncrBy: jest.fn(
                async (key: string, objectName: string, increment: number) => {
                    const existingData = redisData.get(key);

                    redisData.set(key, {
                        [objectName]:
                            parseInt(
                                existingData ? existingData[objectName] : "1",
                            ) + increment,
                    });
                    return "OK";
                },
            ),
            hGetAll: jest.fn(async (key: string) => redisData.get(key) || {}),
            hSet: jest.fn(
                async (key: string, objectName: string, value: any) => {
                    const existingData = redisData.get(key);

                    redisData.set(key, {
                        ...existingData,
                        [objectName]: value,
                    });

                    return "OK";
                },
            ),
            expire: jest.fn(),
            hDel: jest.fn(),
        },
    };
};
