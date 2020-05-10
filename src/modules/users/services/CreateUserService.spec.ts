import AppError from "@shared/errors/AppError";

import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import CreateUserService from "./CreateUserService";

describe("CreateUser", () => {
  let fakeUsersRepository: FakeUsersRepository;
  let fakeHashProvider: FakeHashProvider;

  let createUser: CreateUserService;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  });
  it("should be able to create a new user", async () => {
    const user = await createUser.execute({
      name: "matehus mm",
      email: "matheus@h.com",
      password: "123",
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a new user with an email already used", async () => {
    await createUser.execute({
      name: "matehus mm",
      email: "matheus@h.com",
      password: "123",
    });

    await expect(
      createUser.execute({
        name: "matehus mm",
        email: "matheus@h.com",
        password: "123",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
