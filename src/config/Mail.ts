export default {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  // eslint-disable-next-line no-unneeded-ternary
  secure: process.env.MAIL_SECURE === "true" ? true : false,
  auth: {
    user: process.env.MAIL_USER, // generated ethereal user
    pass: process.env.MAIL_PASS, // generated ethereal password
  },
  default: {
    from: "Equipre GoBarber <noreplay@gobarber.com>",
  },
};
