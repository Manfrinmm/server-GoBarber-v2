import express, { Router, Request, Response, NextFunction } from "express";

import { errors } from "celebrate";

import uploadConfig from "@config/upload";
import appointmentRouter from "@modules/appointments/infra/http/routes/appointments.routes";
import providersRouter from "@modules/appointments/infra/http/routes/providers.routes";
import Authenticate from "@modules/users/infra/http/middlewares/Authenticate";
import passwordRouter from "@modules/users/infra/http/routes/password.routes";
import profileRouter from "@modules/users/infra/http/routes/profile.routes";
import sessionRouter from "@modules/users/infra/http/routes/sessions.routes";
import userRouter from "@modules/users/infra/http/routes/users.routes";
import AppError from "@shared/errors/AppError";

const routes = Router();
routes.use("/users", userRouter);
routes.use("/sessions", sessionRouter);
routes.use("/password", passwordRouter);
routes.use("/files", express.static(uploadConfig.tmpFolder));

routes.use(Authenticate);
routes.use("/appointments", appointmentRouter);
routes.use("/providers", providersRouter);
routes.use("/profile", profileRouter);

routes.use(errors());

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
