import { Request, Response } from "express";

import { container } from "tsyringe";

import UpdateUserAvatarService from "@modules/users/services/UpdateUserAvatarService";

class UserController {
  public async update(req: Request, res: Response): Promise<Response> {
    const { file } = req;
    const user_id = req.user.id;

    const updateUserAvatar = container.resolve(UpdateUserAvatarService);

    const user = await updateUserAvatar.execute({
      user_id,
      avatarFilename: file.filename,
    });

    return res.json(user);
  }
}

export default new UserController();
