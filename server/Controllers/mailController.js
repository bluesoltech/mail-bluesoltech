const { sendEmail } = require("../utils/sendEmail.js");
const fs = require("fs");

const mailsender = (email, subject, content, files, user) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      sendEmail(email, subject, content, files, user)
        .then(resolve) // Resolve the promise upon successful email sending
        .catch(reject); // Reject the promise if sending fails
    }, 1000);
  });
};

const emailService = async (req, res) => {
  const recipients = JSON.parse(req.body.recipients);
  const user = JSON.parse(req.body.user);
  try {
    for (const mail of recipients) {
      const mailres = await mailsender(
        mail.Email,
        req.body.subject,

        req.body.htmlContent,
        req.files,
        user
      );
      if (mailres.responseCode == 535) {
        return res
          .status(401)
          .send({ message: "Email and App Password Invalid" });
      }
    }
    for (const file of req.files) {
      const filePath = file.path;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Failed to delete file: ${filePath}`, err);
        } else {
          console.log(`Successfully deleted file: ${filePath}`);
        }
      });
    }
    return res.status(200).send({ message: "All Email Sent Successfully." });
  } catch (err) {
    console.log("Error mail sender", err);
    return res.status(500).send({ message: `Something went wrong! ${err}` });
  }
};

module.exports = { emailService };
