import FakeStorageProvider from "@shared/container/providers/StorageProvider/fake/FakeStorageProvider";
import AppError from "@shared/errors/AppError";

import FakeUserRepository from "../repositories/fakes/FakeUserRepository";
import UpdateUserAvatarService from "./UpdateUserAvatarService";

describe("UpdateUserAvatar", () => {
  it("should be able to update avatar from an user", async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUserRepository,
      fakeStorageProvider,
    );

    const { id } = await fakeUserRepository.create({
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
    const fakeUserRepository = new FakeUserRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUserRepository,
      fakeStorageProvider,
    );

    expect(
      updateUserAvatar.execute({
        user_id: "non-existing-user",
        avatarFilename: "avata.jph",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should delete old avatar when when updating new one", async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const deleteFile = jest.spyOn(fakeStorageProvider, "deleteFile");

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUserRepository,
      fakeStorageProvider,
    );

    const user = await fakeUserRepository.create({
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
