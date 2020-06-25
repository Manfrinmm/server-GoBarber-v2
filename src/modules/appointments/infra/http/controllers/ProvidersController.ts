import { Request, Response } from "express";

import { classToClass } from "class-transformer";
import { container } from "tsyringe";

import ListProvidersService from "@modules/appointments/services/ListProvidersService";

class ProvidersController {
  public async index(req: Request, res: Response): Promise<Response> {
    const user_id = req.user.id;

    const listProvidersService = container.resolve(ListProvidersService);

    const providers = await listProvidersService.execute({ user_id });

    return res.status(201).json(classToClass(providers));
  }
}

export default new ProvidersController();
