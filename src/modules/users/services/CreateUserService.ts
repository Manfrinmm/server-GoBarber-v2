import { hash } from "bcryptjs";
import { injectable, inject } from "tsyringe";

import User from "@modules/users/infra/typeorm/entities/User";
import AppError from "@shared/errors/AppError";

import IUsersRepository from "../repositories/IUsersRepository";

interface IRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ name, email, password }: IRequest): Promise<User> {
    const userExists = await this.usersRepository.findByEmail(email);

    if (userExists) {
      throw new AppError("User already exists");
    }

    const password_hash = await hash(password, 8);

    const user = await this.usersRepository.create({
      name,
      email,
      password: password_hash,
    });

    delete user.password;

    return user;
  }
}

export default CreateUserService;
