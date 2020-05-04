import { getRepository } from "typeorm";

import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

import AuthConfig from "../../config/Auth";
import AppError from "../errors/AppError";
import User from "../models/User";

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

export default class AuthenticateSessionService {
  public async execute({ email, password }: Request): Promise<Response> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new AppError("Wrong credentials ", 401);
    }

    const passwordCompared = await compare(password, user.password);

    if (!passwordCompared) {
      throw new AppError("Wrong credentials ", 401);
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
