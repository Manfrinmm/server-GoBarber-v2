import FakeAppointmentsRepository from "@modules/appointments/repositories/fakes/FakeAppointmentsRepository";
import FakeUsersRepository from "@modules/users/repositories/fakes/FakeUsersRepository";
import AppError from "@shared/errors/AppError";

import ListProviderMonthAvailabilityService from "./ListProviderMonthAvailabilityService";

describe("ListProviderMonthAvailabilityService", () => {
  let fakeUsersRepository: FakeUsersRepository;
  let fakeAppointmentsRepository: FakeAppointmentsRepository;

  let listProvidersMonthAvailability: ListProviderMonthAvailabilityService;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    listProvidersMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it("should be able to list the month availability from provider", async () => {
    // const user1 = await fakeUsersRepository.create({
    //   name: "Provider",
    //   email: "123",
    //   password: "123",
    // });

    const appointments = new Array(10).fill("");

    await Promise.all(
      appointments.map((_, index) =>
        fakeAppointmentsRepository.create({
          provider_id: "provider",
          user_id: "client",
          date: new Date(2020, 3, 10, 8 + index, 0, 0),
        }),
      ),
    );

    await fakeAppointmentsRepository.create({
      provider_id: "provider",
      user_id: "client1",
      date: new Date(2020, 4, 11, 10, 0, 0),
    });

    const availability = await listProvidersMonthAvailability.execute({
      provider_id: "provider",
      year: 2020,
      month: 4,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 9, available: true },
        { day: 10, available: false },
        { day: 11, available: true },
      ]),
    );
  });
});
