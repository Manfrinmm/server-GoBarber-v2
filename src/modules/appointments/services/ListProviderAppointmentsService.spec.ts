import FakeAppointmentsRepository from "@modules/appointments/repositories/fakes/FakeAppointmentsRepository";
import FakeUsersRepository from "@modules/users/repositories/fakes/FakeUsersRepository";
import FakeCacheProvider from "@shared/container/providers/CacheProvider/fakes/FakeRedisCacheProvider";
import AppError from "@shared/errors/AppError";

import ListProviderAppointmentsService from "./ListProviderAppointmentsService";

describe("ListProviderAppointmentsService", () => {
  let fakeUsersRepository: FakeUsersRepository;
  let fakeAppointmentsRepository: FakeAppointmentsRepository;
  let fakeCacheProvider: FakeCacheProvider;

  let listProviderAppointments: ListProviderAppointmentsService;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProviderAppointments = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
      fakeCacheProvider,
    );
  });

  it("should be able to list the appointments on a specific day", async () => {
    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id: "provider",
      user_id: "client1",
      date: new Date(2020, 4, 11, 13, 0, 0),
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: "provider",
      user_id: "client1",
      date: new Date(2020, 4, 11, 14, 0, 0),
    });

    const appointments = await listProviderAppointments.execute({
      provider_id: "provider",
      year: 2020,
      month: 5,
      day: 11,
    });

    expect(appointments).toEqual([appointment1, appointment2]);
  });
});
