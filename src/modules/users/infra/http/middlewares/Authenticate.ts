import { Request, Response, NextFunction } from "express";

import { verify } from "jsonwebtoken";

import authConfig from "@config/Auth";
import AppError from "@shared/errors/AppError";

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
  payload: object | null;
}
export default function (
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token is missing", 401);
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = verify(token, authConfig.secret);

    const { sub } = decoded as ITokenPayload;

    req.user = {
      id: sub,
    };

    return next();
  } catch (err) {
    console.log(err);

    throw new AppError("Token is not valid", 401);
  }
}
