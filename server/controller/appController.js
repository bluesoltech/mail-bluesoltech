const nodeMailer = require("nodemailer");
const Mailgen = require("mailgen");
const { EMAIL, PASSWORD } = require("../env.js");

// Sending mail from testing account
const signUp = async (req, res) => {
  // testing account
  let testAccount = await nodeMailer.createTestAccount();

  //   create reusable transport object
  let transporter = nodeMailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  let message = {
    from: "'Yash Patel' <yash@example.com>",
    to: "'Raj Patel' <raj@example.com>",
    subject: "Test",
    text: "You got your email.",
    html: "<h1>You got your email.</h1>",
  };

  transporter.sendMail(message).then((info) => {
    return res
      .status(201)
      .json({
        message: "You should receive an email",
        info: info.messageId,
        preview: nodeMailer.getTestMessageUrl(info),
      })
      .catch((error) => {
        return res.status(500).json({ error });
      });
  });

  //   res.status(201).json("Signup successfully...");
};

// Sending mail from real gmail account
const getBill = (req, res) => {
  const { userEmail } = "yash.dev.bluesoltech@gmail.com";

  let config = {
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: PASSWORD,
    },
  };

  let transporter = nodeMailer.createTransport(config);

  let MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Mailgen",
      link: "https://mailgen.js",
    },
  });

  let response = {
    body: {
      name: "Yash Patel",
      intro: "Your mail has received!",
      table: {
        data: [
          {
            item: "Developer",
            description: "Yash Patel is a MERN Stack developer.",
            price: "$30.99",
          },
        ],
      },
      outro: "Looking forward to do more business.",
    },
  };

  let mail = MailGenerator.generate(response);

  let message = {
    from: EMAIL,
    to: userEmail,
    subject: "Marketing",
    html: mail,
  };

  transporter
    .sendMail(message)
    .then(() => {
      return res.status(201).json({
        msg: "You should receive an email.",
      });
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });

  res.status(201).json("getBill successfully...");
};

module.exports = {
  signUp,
  getBill,
};
