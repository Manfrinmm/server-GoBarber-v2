import { Router, Request, Response, NextFunction } from "express";

import appointmentRouter from "@modules/appointments/infra/http/routes/appointments.routes";
import Authenticate from "@modules/users/infra/http/middlewares/Authenticate";
import sessionRouter from "@modules/users/infra/http/routes/sessions.routes";
import userRouter from "@modules/users/infra/http/routes/users.routes";
import AppError from "@shared/errors/AppError";

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
