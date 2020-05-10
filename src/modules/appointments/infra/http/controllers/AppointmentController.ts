import { Request, Response } from "express";

import { parseISO } from "date-fns";
import { container } from "tsyringe";

import AppointmentsRepository from "@modules/appointments/infra/typeorm/repositories/AppointmentsRepository";
import CreateAppointmentService from "@modules/appointments/services/CreateAppointmentService";

class AppointmentController {
  // public async index(req: Request, res: Response): Promise<Response> {

  //   const

  //   const appointments = await

  //   res.status(200).json(appointments);
  // }

  public async create(req: Request, res: Response): Promise<Response> {
    const user_id = req.user.id;

    const { date, provider_id } = req.body;

    const parsedData = parseISO(date);

    const data = {
      date: parsedData,
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
