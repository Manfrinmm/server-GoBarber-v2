import AppError from "@shared/errors/AppError";

import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";
import FakeUserRepository from "../repositories/fakes/FakeUserRepository";
import CreateUserService from "./CreateUserService";

describe("CreateUser", () => {
  it("should be able to create a new user", async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );

    const user = await createUser.execute({
      name: "matehus mm",
      email: "matheus@h.com",
      password: "123",
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a new user with an email already used", async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );

    await createUser.execute({
      name: "matehus mm",
      email: "matheus@h.com",
      password: "123",
    });

    expect(
      createUser.execute({
        name: "matehus mm",
        email: "matheus@h.com",
        password: "123",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
