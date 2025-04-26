const mailerCredentials = {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.MAIL_USER, // generated ethereal user
    pass: process.env.MAIL_PASSWORD, // generated ethereal password
  },
};

export default mailerCredentials;
