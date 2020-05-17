import { Router } from "express";

import { celebrate, Segments, Joi } from "celebrate";
import multer from "multer";

import uploadConfig from "@config/upload";
import Authenticate from "@modules/users/infra/http/middlewares/Authenticate";

import UserAvatarController from "../controllers/UserAvatarController";
import UserController from "../controllers/UserController";

const routes = Router();

const upload = multer(uploadConfig.multer);

routes.get("/", UserController.index);

routes.post(
  "/",
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      password_confirmation: Joi.string().required().valid(Joi.ref("password")),
    },
  }),
  UserController.create,
);

routes.use(Authenticate);

routes.patch("/avatar", upload.single("file"), UserAvatarController.update);

export default routes;
