import { startOfHour, isBefore, getHours, format } from "date-fns";
import { injectable, inject } from "tsyringe";

import Appointment from "@modules/appointments/infra/typeorm/entities/Appointment";
import IAppointmentsRepository from "@modules/appointments/repositories/IAppointmentsRepository";
import INotificationsRepository from "@modules/notifications/repositories/INotificationsRepository";
import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";
import AppError from "@shared/errors/AppError";

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
    @inject("NotificationsRepository")
    private notificationsRepository: INotificationsRepository,
    @inject("CacheProvider")
    private cacheProvider: ICacheProvider,
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
      provider_id,
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

    const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'");

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para dia ${dateFormatted}`,
    });

    await this.cacheProvider.invalidate(
      `provider-appointments:${provider_id}:${format(
        appointmentDate,
        "yyyy'-'M'-'d",
      )}`,
    );

    return appointment;
  }
}

export default CreateAppointmentService;
