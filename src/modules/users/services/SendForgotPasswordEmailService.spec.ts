import FakeMailProvider from "@shared/container/providers/MailProvider/fakes/FakeMailProvider";
import AppError from "@shared/errors/AppError";

import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeUserTokensRepository from "../repositories/fakes/FakeUserTokensRepository";
import SendForgotPasswordEmail from "./SendForgotPasswordEmailService";

describe("SendForgotPasswordEmail", () => {
  let fakeUsersRepository: FakeUsersRepository;
  let fakeUserTokensRepository: FakeUserTokensRepository;
  let fakeMailProvider: FakeMailProvider;

  let sendForgotPasswordEmail: SendForgotPasswordEmail;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeMailProvider = new FakeMailProvider();

    sendForgotPasswordEmail = new SendForgotPasswordEmail(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  it("should be able to recover the password using the email", async () => {
    const sendMail = jest.spyOn(fakeMailProvider, "sendMail");

    await fakeUsersRepository.create({
      name: "matehus mm",
      email: "matheus@h.com",
      password: "123",
    });

    await sendForgotPasswordEmail.execute({ email: "matheus@h.com" });

    expect(sendMail).toHaveBeenCalled();
  });

  it("should not be able to recover a non-existing user", async () => {
    await expect(
      sendForgotPasswordEmail.execute({ email: "matheus@h.com" }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should generate a forgot password token", async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, "generate");

    const user = await fakeUsersRepository.create({
      name: "matehus mm",
      email: "matheus@h.com",
      password: "123",
    });

    await sendForgotPasswordEmail.execute({ email: user.email });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
