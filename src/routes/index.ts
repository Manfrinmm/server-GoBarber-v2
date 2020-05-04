import { Router, Request, Response, NextFunction } from "express";

import AppError from "../app/errors/AppError";
import Authenticate from "../app/middlewares/Authenticate";
import appointmentRouter from "./appointments.routes";
import sessionRouter from "./sessions.routes";
import userRouter from "./users.routes";

const routes = Router();
routes.use("/users", userRouter);
routes.use("/sessions", sessionRouter);
routes.use(Authenticate);
routes.use("/appointments", appointmentRouter);

routes.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      type: "error",
      message: err.message,
    });
  }

  if (process.env.NODE_ENV === "development") {
    return res.status(500).json({
      type: "error",
      message: err.message,
    });
  }

  return res.status(500).json({
    type: "error",
    message: "Internal server error",
  });
});

export default routes;
