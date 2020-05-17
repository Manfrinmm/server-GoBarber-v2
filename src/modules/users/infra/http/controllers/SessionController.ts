import { Request, Response } from "express";

import { classToClass } from "class-transformer";
import { container } from "tsyringe";

import AuthenticateSessionService from "@modules/users/services/AuthenticateSessionService";

class SessionController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const createSession = container.resolve(AuthenticateSessionService);

    const { user, token } = await createSession.execute({ email, password });

    return res.status(201).json({ user: classToClass(user), token });
  }
}

export default new SessionController();
