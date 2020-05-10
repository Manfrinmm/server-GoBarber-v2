import { Request, Response } from "express";

import { container } from "tsyringe";

import ShowProfileService from "@modules/users/services/ShowProfileService";
import UpdateProfileService from "@modules/users/services/UpdateProfileService";

class ProfileController {
  public async show(req: Request, res: Response): Promise<Response> {
    const showProfile = container.resolve(ShowProfileService);

    const user_id = req.user.id;

    const user = await showProfile.execute({ user_id });

    delete user.password;

    return res.json(user);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const user_id = req.user.id;

    const { name, email, password, old_password } = req.body;

    const updateProfile = container.resolve(UpdateProfileService);

    const user = await updateProfile.execute({
      user_id,
      name,
      email,
      password,
      old_password,
    });

    delete user.password;

    return res.status(201).json(user);
  }
}

export default new ProfileController();
