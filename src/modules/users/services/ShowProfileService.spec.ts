import AppError from "@shared/errors/AppError";

import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import ShowProfileService from "./ShowProfileService";

describe("UpdateUserAvatar", () => {
  let fakeUsersRepository: FakeUsersRepository;

  let showProfile: ShowProfileService;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it("should be able to show the profile", async () => {
    const user = await fakeUsersRepository.create({
      name: "matheus",
      email: "123",
      password: "123",
    });

    const profile = await showProfile.execute({
      user_id: user.id,
    });

    expect(profile).toEqual(user);
  });

  it("should not be able to show the profile on non-existing user", async () => {
    await expect(
      showProfile.execute({
        user_id: "non-existing-user",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
