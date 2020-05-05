import { Request, Response } from "express";
import { getRepository } from "typeorm";

import { container } from "tsyringe";

import User from "@modules/users/infra/typeorm/entities/User";
import CreateUserService from "@modules/users/services/CreateUserService";

class UserController {
  public async index(req: Request, res: Response): Promise<Response> {
    const usersRepo = getRepository(User);
    const users = await usersRepo.find();

    return res.json(users);
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({ name, email, password });

    return res.status(201).json(user);
  }

  // public async update(req: Request, res: Response): Promise<Response> {
  //   const { file } = req;
  //   const user_id = req.user.id;

  //   const updateUserAvatar = container.resolve(UpdateUserAvatarService);

  //   const user = await updateUserAvatar.execute({
  //     user_id,
  //     avatarFilename: file.filename,
  //   });

  //   return res.json(user);
  // }
}

export default new UserController();
