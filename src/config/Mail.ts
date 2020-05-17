interface IMailConfig {
  driver: "ethereal" | "ses";
  default: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || "ethereal",
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  // eslint-disable-next-line no-unneeded-ternary
  secure: process.env.MAIL_SECURE === "true" ? true : false,
  auth: {
    user: process.env.MAIL_USER, // generated ethereal user
    pass: process.env.MAIL_PASS, // generated ethereal password
  },
  default: {
    from: {
      email: "gobarber@devmatheus.com",
      name: "Go Barber",
    },
  },
} as IMailConfig;
