import AppError from "@shared/errors/AppError";

import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";
import FakeUserRepository from "../repositories/fakes/FakeUserRepository";
import AuthenticateSessionService from "./AuthenticateSessionService";
import CreateUserService from "./CreateUserService";

describe("AuthenticateUser", () => {
  it("should be able to authenticate", async () => {
    // const fakeUserRepository = new FakeUserRepository();
    // const fakeHashProvider = new FakeHashProvider();
    // const createUser = new CreateUserService(
    //   fakeUserRepository,
    //   fakeHashProvider,
    // );
    // const authenticateSession = new AuthenticateSessionService(
    //   fakeUserRepository,
    //   fakeHashProvider,
    // );
    // const user = await createUser.execute({
    //   name: "matheus 123 ",
    //   email: "matheus@h.com",
    //   password: "123",
    // });
    // const response = await authenticateSession.execute({
    //   email: "matheus@h.com",
    //   password: "123",
    // });
    // expect(response).toHaveProperty("token");
    // expect(response.user).toEqual(user);
  });

  it("should not be able to authenticate with non existing user ", async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateSession = new AuthenticateSessionService(
      fakeUserRepository,
      fakeHashProvider,
    );

    expect(
      authenticateSession.execute({
        email: "matheus@h.com",
        password: "123",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to authenticate with wrong password", async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );
    const authenticateSession = new AuthenticateSessionService(
      fakeUserRepository,
      fakeHashProvider,
    );

    await createUser.execute({
      name: "matheus 123 ",
      email: "matheus@h.com",
      password: "123",
    });

    expect(
      authenticateSession.execute({
        email: "matheus@h.com",
        password: "123123123",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
