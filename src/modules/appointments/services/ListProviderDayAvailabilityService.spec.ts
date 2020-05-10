import FakeAppointmentsRepository from "@modules/appointments/repositories/fakes/FakeAppointmentsRepository";
import FakeUsersRepository from "@modules/users/repositories/fakes/FakeUsersRepository";
import AppError from "@shared/errors/AppError";

import ListProviderDayAvailabilityService from "./ListProviderDayAvailabilityService";

describe("ListProviderDayAvailabilityService", () => {
  let fakeUsersRepository: FakeUsersRepository;
  let fakeAppointmentsRepository: FakeAppointmentsRepository;

  let listProviderDayAvailability: ListProviderDayAvailabilityService;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    listProviderDayAvailability = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it("should be able to list the day availability from provider", async () => {
    await fakeAppointmentsRepository.create({
      provider_id: "provider",
      user_id: "client1",
      date: new Date(2020, 4, 11, 13, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: "provider",
      user_id: "client1",
      date: new Date(2020, 4, 11, 14, 0, 0),
    });

    jest
      .spyOn(Date, "now")
      .mockImplementationOnce(() => new Date(2020, 4, 11, 11).getTime());

    const availability = await listProviderDayAvailability.execute({
      provider_id: "provider",
      year: 2020,
      month: 5,
      day: 11,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 13, available: false },
        { hour: 14, available: false },
        { hour: 15, available: true },
      ]),
    );
  });
});
