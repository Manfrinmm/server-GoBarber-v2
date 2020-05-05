import { Router } from "express";

import multer from "multer";

import MulterConfig from "@config/Multer";
import Authenticate from "@modules/users/infra/http/middlewares/Authenticate";

import UserAvatarController from "../controllers/UserAvatarController";
import UserController from "../controllers/UserController";

const routes = Router();

const upload = multer(MulterConfig);

routes.get("/", UserController.index);

routes.post("/", UserController.create);

routes.use(Authenticate);

routes.patch("/avatar", upload.single("file"), UserAvatarController.update);

export default routes;
