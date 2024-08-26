const { env } = require("../config");
const { generateToken } = require("./jwt-handle");
const { sendMail } = require("./send-email");

const sendAccountVerificationEmail = async ({ userId, userEmail }) => {
    const pwdToken = generateToken(
        { id: userId },
        env.emailVerificationTokenSecret,
        env.emailVerificationTokenTimeInMS
    );
    const link = `${env.apiRoute}/api/v1/auth/verify-email/${pwdToken}`;
    const mailOptions = {
        from: env.mailAuthUser,
        to: userEmail,
        subject: "Verify account",
        html: `
        <p>
            Click on the link below to verify your account.
            <br />
            <a href=${link}>${link}</a>
        </p>`,
    };
    await sendMail(mailOptions);
}

module.exports = { sendAccountVerificationEmail };