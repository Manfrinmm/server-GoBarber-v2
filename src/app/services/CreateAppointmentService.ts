import { getCustomRepository } from "typeorm";

import { startOfDay } from "date-fns";

import Appointment from "../models/Appointment";
import AppointmentsRepository from "../repositories/AppointmentsRepository";

interface Request {
  date: Date;
  user_id: number;
  provider_id: number;
}

class CreateAppointmentService {
  appointmentsRepository = getCustomRepository(AppointmentsRepository);

  public async execute({
    date,
    user_id,
    provider_id,
  }: Request): Promise<Appointment> {
    const appointmentDate = startOfDay(date);

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw Error("Appointment not available");
    }

    const appointment = this.appointmentsRepository.create({
      date: appointmentDate,
      user_id,
      provider_id,
    });

    await this.appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
