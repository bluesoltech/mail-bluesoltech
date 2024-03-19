const { sendEmail } = require('../utils/sendEmail.js')

const mailsender = async (email, subject, content) => {
    await sendEmail(email, subject, content);
}

const emailService = async (req, res) => {
    const mails = [{
        email: "dev.kunal.bluesoltech@gmail.com",
        name: "Kunal"
    }
    ,
    {
        email: "dev.hardikbluesoltech@gmail.com",
        name: "Hardik"
    }
    ,
    {
        email: "ui.sahil.bluesoltech@gmail.com",
        name: "Sahil"
    }
    ,
    {
        email: "ui.riya.bluesoltech@gmail.com",
        name: "Riya"
    }
    ,
    {
        email: "dev.bansi.bluesoltech@gmail.com",
        name: "Bansi"
    }
    ,
    {
        email: "ui.krushn.bluesoltech@gmail.com",
        name: "KK"
    }
    
]
    // const {mails, subject, content} = req.body;
    try {
        mails.map((mail) => {
            mailsender(mail.email, mail.name, "content")
        })

        return res
            .status(200)
            .send({ message: "All Email Sent Successfully." });
    } catch (err) {
        console.log(err);
    }

};

module.exports = { emailService };
