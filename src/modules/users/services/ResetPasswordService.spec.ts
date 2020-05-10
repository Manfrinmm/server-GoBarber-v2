import AppError from "@shared/errors/AppError";

import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeUserTokensRepository from "../repositories/fakes/FakeUserTokensRepository";
import ResetPasswordService from "./ResetPasswordService";

describe("ResetPasswordService", () => {
  let fakeUsersRepository: FakeUsersRepository;
  let fakeUserTokensRepository: FakeUserTokensRepository;
  let fakeHashProvider: FakeHashProvider;

  let resetPassword: ResetPasswordService;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });

  it("should be able to reset user password", async () => {
    const user = await fakeUsersRepository.create({
      name: "matehus mm",
      email: "matheus@h.com",
      password: "123",
    });

    const generateHash = jest.spyOn(fakeHashProvider, "generateHash");

    const { token } = await fakeUserTokensRepository.generate(user.id);

    await resetPassword.execute({ password: "312", token });

    const updatedUser = await fakeUsersRepository.findByEmail(user.email);

    expect(generateHash).toHaveBeenCalledWith("312");
    expect(updatedUser?.password).toBe("312");
  });

  it("should not be able to reset the password with non-existing token", async () => {
    await expect(
      resetPassword.execute({ token: "non-existing-token", password: "123" }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to reset the password with non-existing user", async () => {
    const { token } = await fakeUserTokensRepository.generate(
      "non-existing-user",
    );

    await expect(
      resetPassword.execute({ token, password: "123" }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to reset password if passed more than 2 hours", async () => {
    const user = await fakeUsersRepository.create({
      name: "matehus mm",
      email: "matheus@h.com",
      password: "123",
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPassword.execute({ token, password: "321" }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to delete token after the reset password", async () => {
    const user = await fakeUsersRepository.create({
      name: "matehus mm",
      email: "matheus@h.com",
      password: "123",
    });

    const userToken = await fakeUserTokensRepository.generate(user.id);

    const deletedToken = jest.spyOn(fakeUserTokensRepository, "delete");

    await resetPassword.execute({ token: userToken.token, password: "321" });

    expect(deletedToken).toHaveBeenCalledWith(userToken);
  });
});
