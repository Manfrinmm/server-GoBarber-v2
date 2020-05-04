import { getRepository } from "typeorm";

import fs from "fs";
import path from "path";

import AppError from "../errors/AppError";
import User from "../models/User";

interface Request {
  user_id: string;
  avatarFilename: string;
}
export default class UpdateUserAvatarService {
  public async execute({ user_id, avatarFilename }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne(user_id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.avatar) {
      const pathToTmpFolder = path.resolve(__dirname, "..", "..", "..", "tmp");

      const userAvatarFilePath = path.join(pathToTmpFolder, user.avatar);

      try {
        const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

        if (userAvatarFileExists) {
          await fs.promises.unlink(userAvatarFilePath);
        }
      } catch (err) {
        console.error(err);
      }
    }

    user.avatar = avatarFilename;

    await usersRepository.save(user);

    return user;
  }
}
