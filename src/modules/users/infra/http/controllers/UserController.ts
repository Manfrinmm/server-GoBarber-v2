import { Request, Response } from "express";
import { getRepository } from "typeorm";

import { classToClass } from "class-transformer";
import { container } from "tsyringe";

import User from "@modules/users/infra/typeorm/entities/User";
import CreateUserService from "@modules/users/services/CreateUserService";

class UserController {
  public async index(req: Request, res: Response): Promise<Response> {
    const usersRepo = getRepository(User);
    const users = await usersRepo.find();

    return res.json(classToClass(users));
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({ name, email, password });

    delete user.password;

    return res.status(201).json(classToClass(user));
  }
}

export default new UserController();
