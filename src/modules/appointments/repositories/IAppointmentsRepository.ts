import Appointment from "@modules/appointments/infra/typeorm/entities/Appointment";

import ICreateAppointmentDTO from "../dtos/ICreateAppointmentDTO";

// Define quais métodos precisam existir no repository

export default interface IAppointmentsRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  // find(): Promise<Appointment[] | undefined>;
  findByDate(date: Date): Promise<Appointment | undefined>;
}
