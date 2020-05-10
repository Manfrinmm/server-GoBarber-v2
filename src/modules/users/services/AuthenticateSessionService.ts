import { sign } from "jsonwebtoken";
import { injectable, inject } from "tsyringe";

import AuthConfig from "@config/Auth";
import User from "@modules/users/infra/typeorm/entities/User";
import AppError from "@shared/errors/AppError";

import IHashProvider from "../providers/HashProvider/models/IHashProvider";
import IUsersRepository from "../repositories/IUsersRepository";

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

@injectable()
export default class AuthenticateSessionService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("HashProvider")
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Wrong credentials", 401);
    }

    const passwordCompared = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordCompared) {
      throw new AppError("Wrong credentials", 401);
    }

    const { secret, expiresIn } = AuthConfig;

    const token = sign({}, secret, {
      expiresIn,
      subject: user.id,
    });

    delete user.password;

    return {
      user,
      token,
    };
  }
}
