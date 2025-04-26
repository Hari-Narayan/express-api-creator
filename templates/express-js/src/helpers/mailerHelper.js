import { createTransport } from "nodemailer";

const transporter = createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.MAIL_USER, // generated ethereal user
    pass: process.env.MAIL_PASSWORD, // generated ethereal password
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function mailer({ to, subject = "", text = "", html = "" }) {
  let mailOptions = {
    to: to,
    subject,
    from: process.env.MAIL_SENDER, // sender address
  };

  if (html) mailOptions.html = html;
  if (text) mailOptions.text = text;

  // list of receivers
  if (Array.isArray(to)) mailOptions.to = to.join(", ");

  try {
    // send mail with defined transport object
    const info = await transporter.sendMail(mailOptions);
    console.info("Message sent: %s", info.messageId);
  } catch (error) {
    console.error({ error });
  }
}

export default mailer;
