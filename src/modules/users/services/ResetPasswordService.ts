import { differenceInHours } from "date-fns";
import { injectable, inject } from "tsyringe";

import IHashProvider from "@modules/users/providers/HashProvider/models/IHashProvider";
import AppError from "@shared/errors/AppError";

import IUsersRepository from "../repositories/IUsersRepository";
import IUserTokensRepository from "../repositories/IUserTokensRepository";

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("UserTokensRepository")
    private userTokensRepository: IUserTokensRepository,

    @inject("HashProvider")
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError("User token does not exists", 404);
    }

    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError("User does not exists", 404);
    }

    const tokenCreatedAt = userToken.created_at;

    if (differenceInHours(Date.now(), tokenCreatedAt) > 2) {
      throw new AppError("Token expired", 401);
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.userTokensRepository.delete(userToken);

    await this.usersRepository.save(user);
  }
}

export default SendForgotPasswordEmailService;
