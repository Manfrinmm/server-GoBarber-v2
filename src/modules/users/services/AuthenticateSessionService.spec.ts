import AppError from "@shared/errors/AppError";

import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import AuthenticateSessionService from "./AuthenticateSessionService";
import CreateUserService from "./CreateUserService";

describe("AuthenticateUser", () => {
  let fakeUsersRepository: FakeUsersRepository;
  let fakeHashProvider: FakeHashProvider;
  let createUser: CreateUserService;
  let authenticateSession: AuthenticateSessionService;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    authenticateSession = new AuthenticateSessionService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it("should be able to authenticate", async () => {
    const user = await createUser.execute({
      name: "matheus 123 ",
      email: "matheus@h.com",
      password: "123",
    });

    const response = await authenticateSession.execute({
      email: "matheus@h.com",
      password: "123",
    });

    expect(response).toHaveProperty("token");
    expect(response.user).toEqual(user);
  });

  it("should not be able to authenticate with non existing user ", async () => {
    await expect(
      authenticateSession.execute({
        email: "matheus@h.com",
        password: "123",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to authenticate with wrong password", async () => {
    await createUser.execute({
      name: "matheus 123 ",
      email: "matheus@h.com",
      password: "123",
    });

    await expect(
      authenticateSession.execute({
        email: "matheus@h.com",
        password: "312312312",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
