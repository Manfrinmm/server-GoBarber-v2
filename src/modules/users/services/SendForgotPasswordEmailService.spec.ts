import FakeMailProvider from "@shared/container/providers/MailProvider/fakes/FakeMailProvider";
import AppError from "@shared/errors/AppError";

import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import SendForgotPasswordEmail from "./SendForgotPasswordEmailService";

describe("SendForgotPasswordEmail", () => {
  let fakeUsersRepository: FakeUsersRepository;
  let sendForgotPasswordEmail: SendForgotPasswordEmail;
  let fakeMailProvider: FakeMailProvider;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();

    sendForgotPasswordEmail = new SendForgotPasswordEmail(
      fakeUsersRepository,
      fakeMailProvider,
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
});
