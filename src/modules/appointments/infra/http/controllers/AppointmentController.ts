import { Request, Response } from "express";

import { container } from "tsyringe";

import CreateAppointmentService from "@modules/appointments/services/CreateAppointmentService";

class AppointmentController {
  public async create(req: Request, res: Response): Promise<Response> {
    const user_id = req.user.id;

    const { date, provider_id } = req.body;

    const data = {
      date,
      user_id,
      provider_id,
    };

    const createAppointmentService = container.resolve(
      CreateAppointmentService,
    );

    try {
      const appointment = await createAppointmentService.execute(data);

      return res.status(201).json(appointment);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}

export default new AppointmentController();
