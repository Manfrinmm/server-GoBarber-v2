import FakeUsersRepository from "@modules/users/repositories/fakes/FakeUsersRepository";
import FakeCacheProvider from "@shared/container/providers/CacheProvider/fakes/FakeRedisCacheProvider";
import AppError from "@shared/errors/AppError";

import ListProvidersService from "./ListProvidersService";

describe("ListProvidersService", () => {
  let fakeUsersRepository: FakeUsersRepository;
  let fakeCacheProvider: FakeCacheProvider;

  let listProviders: ListProvidersService;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProviders = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });

  it("should be able to list the providers", async () => {
    const user1 = await fakeUsersRepository.create({
      name: "matheus1",
      email: "123",
      password: "123",
    });

    const user2 = await fakeUsersRepository.create({
      name: "matheus2",
      email: "123123",
      password: "123",
    });

    const loggedUser = await fakeUsersRepository.create({
      name: "loggedUser",
      email: "312",
      password: "123",
    });

    const providers = await listProviders.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});
