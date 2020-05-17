import { Router } from "express";

import { celebrate, Segments, Joi } from "celebrate";

import SessionController from "../controllers/SessionController";

const routes = Router();

routes.post(
  "/",
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  SessionController.create,
);

export default routes;
