import { injectable, inject } from "tsyringe";

import User from "@modules/users/infra/typeorm/entities/User";
import AppError from "@shared/errors/AppError";

import IHashProvider from "../providers/HashProvider/models/IHashProvider";
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

    @inject("HashProvider")
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ name, email, password }: IRequest): Promise<User> {
    const userExists = await this.usersRepository.findByEmail(email);

    if (userExists) {
      throw new AppError("User already exists");
    }

    const password_hash = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      email,
      password: password_hash,
    });

    return user;
  }
}

export default CreateUserService;
