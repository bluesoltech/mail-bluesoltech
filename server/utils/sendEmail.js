const nodemailer = require("nodemailer");

const sendEmail = async (mail, subject, content, attachments = []) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: String(process.env.USER),
        pass: String(process.env.PASS),
      },
    });

    await transporter.sendMail({
      from: process.env.USER,
      to: mail,
      subject: subject,
      html: content,
      attachments: attachments,
    });
  } catch (err) {
    console.log("email not sent!");
    console.log(err);
    return err;
  }
};

module.exports = { sendEmail };
