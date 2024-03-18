const nodemailer = require("nodemailer");

require("dotenv").config();

const { META_PASSWORD } = process.env;

const nodemailerConfig = {
    host: "smtp.meta.ua",
    port: 465,
    secure: true,
    auth: {
        user: "leila_sokolova@meta.ua",
        pass: META_PASSWORD,
    }
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
    try {
        const email = { ...data, from: "leila_sokolova@meta.ua" };
        await transport.sendMail(email);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error.message);
    }
};

module.exports = sendEmail; 

/* const sendEmail = {
    to: "gahexe7418@mcuma.com",
    from: "leila_sokolova@meta.ua",
    subject: "Test email",
    html: "<p>Hello, email!</p>",
};

transport.sendMail(sendEmail)
    .then(() => console.log("Email send success"))
    .catch(error => console.log(error.message)); */

   


