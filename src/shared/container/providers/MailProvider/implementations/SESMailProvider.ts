import aws from "aws-sdk";
import nodemailer, { Transporter } from "nodemailer";
import { inject, injectable } from "tsyringe";

import mailConfig from "@config/Mail";
import IMailTemplateProvider from "@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider";

import ISendMailDTO from "../dtos/ISendMailDTO";
import IMailProvider from "../models/IMailProvider";

@injectable()
export default class SESMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject("MailTemplateProvider")
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    this.client = nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: "2010-12-01",
        region: "us-east-1",
      }),
    });
  }

  public async sendMail({
    to,
    from,
    subject,
    templateData,
  }: ISendMailDTO): Promise<void> {
    const { email, name } = mailConfig.default.from;

    await this.client.sendMail({
      to: {
        name: to.name,
        address: to.email,
      },
      from: {
        name: from?.name || name,
        address: from?.email || email,
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    });
  }
}
