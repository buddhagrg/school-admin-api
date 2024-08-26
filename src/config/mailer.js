const nodemailer = require("nodemailer");
const { env } = require("./env");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: env.mailAuthUser,
        pass: env.mailAuthPassword
    }
});

module.exports = {
    transporter
};