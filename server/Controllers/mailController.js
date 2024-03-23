const { sendEmail } = require("../utils/sendEmail.js");
const fs = require("fs");

const mailsender = async (email, subject, content, files) => {
  await sendEmail(email, subject, content, files);
};

const emailService = async (req, res) => {
  const recipients = JSON.parse(req.body.recipients);
  try {
    const emailPromises = recipients.map((mail) =>
      mailsender(mail.Email, req.body.subject, req.body.htmlContent, req.files)
    );

    await Promise.all(emailPromises);

    req.files.forEach((file) => {
      const filePath = file.path; // Full path to the file

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Failed to delete file: ${filePath}`, err);
          // Handle the error (you might want to log it or send a different response)
        } else {
          console.log(`Successfully deleted file: ${filePath}`);
        }
      });
    });

    return res.status(200).send({ message: "All Email Sent Successfully." });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { emailService };
