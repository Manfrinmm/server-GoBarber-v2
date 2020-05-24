import { Request, Response } from "express";

import { classToClass } from "class-transformer";
import { container } from "tsyringe";

import ListProviderAppointmentsService from "@modules/appointments/services/ListProviderAppointmentsService";

class ProviderAppointmentsController {
  public async index(req: Request, res: Response): Promise<Response> {
    const provider_id = req.user.id;

    const { year, month, day } = req.query;

    const listProviderAppointments = container.resolve(
      ListProviderAppointmentsService,
    );

    try {
      const appointments = await listProviderAppointments.execute({
        provider_id,
        year: Number(year),
        month: Number(month),
        day: Number(day),
      });

      return res.status(201).json(classToClass(appointments));
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}

export default new ProviderAppointmentsController();
