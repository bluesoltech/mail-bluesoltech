const { sendEmail } = require("../utils/sendEmail.js");

const mailsender = async (email, subject, content, attachments) => {
  await sendEmail(email, subject, content, attachments);
};

const emailService = async (req, res) => {
  console.log(req.body)
  const { message, emails } = req.body;

  try {
    emails.map((mail) => {
      mailsender(mail, "Yash", message);
    });

    return res.status(200).send({ message: "All Email Sent Successfully." });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { emailService };
