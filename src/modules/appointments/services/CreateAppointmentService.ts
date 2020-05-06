import { startOfDay } from "date-fns";
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
    const appointmentDate = startOfDay(date);

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new AppError("Appointment not available");
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
