const nodemailer = require("nodemailer");

const sendEmail = async (mail, subject, content, files, user) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: user.email,
        pass: user.password,
        // user: String(process.env.USER),
        // pass: String(process.env.PASS),
      },
    });

    const info = await transporter.sendMail({
      from: process.env.USER,
      to: mail,
      subject: subject,
      html: content,
      attachments: files.map((file) => ({ path: file.path })),
    });

    // Successfully sent
    console.log(`Email sent: ${mail}`);
    return info;
  } catch (err) {
    // Handling based on specific error codes or messages
    if (err && err.message.includes("Invalid recipient")) {
      console.log(`Invalid email address: ${mail}`);
    } else {
      console.log(`Error sending email to ${mail}`);
    }
    console.log(err);
    return err;
  }
};

module.exports = { sendEmail };
