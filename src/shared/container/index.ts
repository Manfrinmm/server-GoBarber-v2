import { container } from "tsyringe";

import "@modules/users/providers";
import "./providers";

import AppointmentsRepository from "@modules/appointments/infra/typeorm/repositories/AppointmentsRepository";
import IAppointmentsRepository from "@modules/appointments/repositories/IAppointmentsRepository";
import NotificationsRepository from "@modules/notifications/infra/typeorm/repositories/NotificationsRepository";
import INotificationsRepository from "@modules/notifications/repositories/INotificationsRepository";
import UsersRepository from "@modules/users/infra/typeorm/repositories/UsersRepository";
import UserTokensRepository from "@modules/users/infra/typeorm/repositories/UserTokensRepository";
import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import IUserTokensRepository from "@modules/users/repositories/IUserTokensRepository";

container.registerSingleton<IAppointmentsRepository>(
  "AppointmentsRepository",
  AppointmentsRepository,
);

container.registerSingleton<INotificationsRepository>(
  "NotificationsRepository",
  NotificationsRepository,
);

container.registerSingleton<IUserTokensRepository>(
  "UserTokensRepository",
  UserTokensRepository,
);

container.registerSingleton<IUsersRepository>(
  "UsersRepository",
  UsersRepository,
);
