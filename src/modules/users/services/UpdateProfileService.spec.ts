import AppError from "@shared/errors/AppError";

import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import UpdateProfileService from "./UpdateProfileService";

describe("UpdateProfileService", () => {
  let fakeUsersRepository: FakeUsersRepository;
  let fakeHashProvider: FakeHashProvider;

  let updateProfile: UpdateProfileService;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it("should be able to update the profile", async () => {
    const user = await fakeUsersRepository.create({
      name: "matheus",
      email: "123",
      password: "123",
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: "Matheus MM",
      email: "mat@.com",
    });

    expect(updatedUser.name).toBe("Matheus MM");
    expect(updatedUser.email).toBe("mat@.com");
  });

  it("should not be able to update the profile on non-existing user", async () => {
    await expect(
      updateProfile.execute({
        user_id: "non-existing-user",
        name: "Matheus MM",
        email: "mat@.com",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to change to another user email", async () => {
    await fakeUsersRepository.create({
      name: "matheus",
      email: "email@h.com",
      password: "123",
    });

    const user = await fakeUsersRepository.create({
      name: "matheus",
      email: "teste@h.com",
      password: "123",
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: "Matheus MM",
        email: "email@h.com",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to update the password", async () => {
    const user = await fakeUsersRepository.create({
      name: "matheus",
      email: "123",
      password: "123",
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: "Matheus MM",
      email: "mat@.com",
      old_password: "123",
      password: "321",
    });

    expect(updatedUser.password).toBe("321");
  });

  it("should not be able to update the password without old password", async () => {
    const user = await fakeUsersRepository.create({
      name: "matheus",
      email: "123",
      password: "123",
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: "Matheus MM",
        email: "mat@.com",
        password: "321",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it("should not be able to update the password with wrong old password", async () => {
    const user = await fakeUsersRepository.create({
      name: "matheus",
      email: "123",
      password: "123",
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: "Matheus MM",
        email: "mat@.com",
        old_password: "wrong-password",
        password: "321",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
