import { startOfHour, isBefore, getHours } from "date-fns";
import { injectable, inject } from "tsyringe";

import Appointment from "@modules/appointments/infra/typeorm/entities/Appointment";
import AppError from "@shared/errors/AppError";

import IAppointmentsRepository from "../repositories/IAppointmentsRepository";

interface IRequest {
  date: Date;
  user_id: string;
  provider_id: string;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject("AppointmentsRepository")
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    date,
    user_id,
    provider_id,
  }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError(
        "You can only create appointments between 8am and 5pm.",
      );
    }

    if (provider_id === user_id) {
      throw new AppError("You can't create an appointment with yourself", 401);
    }

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new AppError("Appointment not available");
    }

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError("You can't create an appointment on past date.");
    }

    const appointment = this.appointmentsRepository.create({
      date: appointmentDate,
      user_id,
      provider_id,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
