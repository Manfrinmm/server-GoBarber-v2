import FakeStorageProvider from "@shared/container/providers/StorageProvider/fake/FakeStorageProvider";
import AppError from "@shared/errors/AppError";

import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import UpdateUserAvatarService from "./UpdateUserAvatarService";

describe("UpdateUserAvatar", () => {
  it("should be able to update avatar from an user", async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const { id } = await fakeUsersRepository.create({
      name: "matheus",
      email: "123",
      password: "123",
    });

    const user = await updateUserAvatar.execute({
      user_id: id,
      avatarFilename: "avata.jph",
    });

    expect(user.avatar).toBe("avata.jph");
  });

  it("should not be able to update avatar from non existing user", async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    await expect(
      updateUserAvatar.execute({
        user_id: "non-existing-user",
        avatarFilename: "avata.jph",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should delete old avatar when when updating new one", async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const deleteFile = jest.spyOn(fakeStorageProvider, "deleteFile");

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const user = await fakeUsersRepository.create({
      name: "matheus",
      email: "123",
      password: "123",
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: "avata.jph",
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: "avata2.jph",
    });

    expect(deleteFile).toHaveBeenCalledWith("avata.jph");
    expect(user.avatar).toBe("avata2.jph");
  });
});
