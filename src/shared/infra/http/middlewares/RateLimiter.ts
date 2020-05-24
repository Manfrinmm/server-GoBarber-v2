import { Request, Response, NextFunction } from "express";

import { RateLimiterRedis, RateLimiterRes } from "rate-limiter-flexible";
import redis from "redis";

import AppError from "@shared/errors/AppError";

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.PASS,
});

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "rateLimite",
  points: 15,
  duration: 5,
  blockDuration: 20,
});

export default async function rateLimiter(
  req: Request,
  rest: Response,
  next: NextFunction,
): Promise<void> {
  let data = {} as RateLimiterRes;

  try {
    data = await limiter.consume(req.ip);

    return next();
  } catch (error) {
    data = error;

    throw new AppError("Too many requests", 429);
  } finally {
    const headers = {
      "Retry-After": data.msBeforeNext / 1000,
      "X-RateLimit-Limit": 15,
      "X-RateLimit-Remaining": data.remainingPoints,
      "X-RateLimit-Reset": new Date(Date.now() + data.msBeforeNext),
    };

    rest.set(headers);
  }
}
