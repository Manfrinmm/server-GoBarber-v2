import { Router } from "express";
import { getRepository } from "typeorm";

import multer from "multer";

import Authenticate from "../app/middlewares/Authenticate";
import User from "../app/models/User";
import CreateUserService from "../app/services/CreateUserService";
import UpdateUserAvatarService from "../app/services/UpdateUserAvatarService";
import MulterConfig from "../config/Multer";

const userRouter = Router();

const upload = multer(MulterConfig);

userRouter.post("/", async (req, res) => {
  const { name, email, password } = req.body;

  const createUser = new CreateUserService();

  const user = await createUser.execute({ name, email, password });

  return res.status(201).json(user);
});

userRouter.get("/", async (req, res) => {
  const usersRepo = getRepository(User);
  const users = await usersRepo.find();

  return res.json(users);
});

userRouter.use(Authenticate);

userRouter.patch("/avatar", upload.single("file"), async (req, res) => {
  const { file } = req;
  const user_id = req.user.id;

  const updateUserAvatar = new UpdateUserAvatarService();

  const user = await updateUserAvatar.execute({
    user_id,
    avatarFilename: file.filename,
  });

  return res.json(user);
});

export default userRouter;
