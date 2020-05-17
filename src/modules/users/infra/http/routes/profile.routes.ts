import { Router } from "express";

import { celebrate, Segments, Joi } from "celebrate";

import ProfileController from "../controllers/ProfileController";

const routes = Router();

routes.get("/", ProfileController.show);

routes.put(
  "/",
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string(),
      password: Joi.string(),
      password_confirmation: Joi.string().valid(Joi.ref("password")),
    },
  }),
  ProfileController.update,
);

export default routes;
