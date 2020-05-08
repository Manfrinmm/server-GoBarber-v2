import AppError from "@shared/errors/AppError";

import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeUserTokensRepository from "../repositories/fakes/FakeUserTokensRepository";
import ResetPasswordService from "./ResetPasswordService";

describe("ResetForgotPasswordEmail", () => {
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

    const { token } = await fakeUserTokensRepository.generate(user.id);

    await resetPassword.execute({ password: "312", token });

    const updatedUser = await fakeUsersRepository.findByEmail(user.email);

    expect(updatedUser?.password).toBe("312");
  });

  // it("should be able to generate hash");
});
