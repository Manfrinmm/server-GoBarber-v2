import FakeNotificationsRepository from "@modules/notifications/repositories/fakes/FakeNotificationsRepository";
import FakeCacheProvider from "@shared/container/providers/CacheProvider/fakes/FakeRedisCacheProvider";
import AppError from "@shared/errors/AppError";

import FakeAppointmentRepository from "../repositories/fakes/FakeAppointmentsRepository";
import CreateAppointmentService from "./CreateAppointmentService";

describe("CreateAppointment", () => {
  let fakeAppointmentRepository: FakeAppointmentRepository;
  let fakeNotificationsRepository: FakeNotificationsRepository;
  let fakeCacheProvider: FakeCacheProvider;
  let createAppointment: CreateAppointmentService;

  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    createAppointment = new CreateAppointmentService(
      fakeAppointmentRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );
  });

  it("should be able to create a new appointment", async () => {
    jest
      .spyOn(Date, "now")
      .mockImplementationOnce(() => new Date(2020, 4, 10, 12).getTime());

    const appointment = await createAppointment.execute({
      date: new Date(2020, 4, 10, 13),
      provider_id: "123123",
      user_id: "1122",
    });

    expect(appointment).toHaveProperty("id");
  });

  it("should not be able to create two appointment on the same time", async () => {
    jest
      .spyOn(Date, "now")
      .mockImplementationOnce(() => new Date(2020, 4, 10, 13).getTime());

    const appointmentDate = new Date(2020, 4, 10, 14);

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: "provider-id",
      user_id: "user-id",
    });

    jest
      .spyOn(Date, "now")
      .mockImplementationOnce(() => new Date(2020, 4, 10, 13).getTime());

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: "provider-id",
        user_id: "user-id",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create an appointment on past date", async () => {
    jest
      .spyOn(Date, "now")
      .mockImplementationOnce(() => new Date(2020, 4, 10, 12).getTime());

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 11),
        provider_id: "123123",
        user_id: "1122",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create an appointment with same user as provider", async () => {
    jest
      .spyOn(Date, "now")
      .mockImplementationOnce(() => new Date(2020, 4, 10, 12).getTime());

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 13),
        provider_id: "123123",
        user_id: "123123",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create an appointment before 8am and after 5pm", async () => {
    jest
      .spyOn(Date, "now")
      .mockImplementationOnce(() => new Date(2020, 4, 10, 12).getTime());

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 7),
        provider_id: "provider-id",
        user_id: "user-id",
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 18),
        provider_id: "provider-id",
        user_id: "user-id",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
