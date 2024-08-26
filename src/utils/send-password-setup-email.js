const { env } = require("../config");
const { generateToken } = require("./jwt-handle");
const { sendMail } = require("./send-email");

const sendPasswordSetupEmail = async ({ userId, userEmail }) => {
    const pwdToken = generateToken(
        { id: userId },
        env.pwdSetupTokenSecret,
        env.pwdSetupTokenTimeInMS
    );
    const link = `${env.uiRoute}/auth/setup-password/${pwdToken}`;
    const mailOptions = {
        from: env.mailAuthUser,
        to: userEmail,
        subject: "Setup account password",
        html: `
        <p>
            Click on the link below to setup your account password.
            <br />
            <a href=${link}>${link}</a>
        </p>`,
    };
    await sendMail(mailOptions);
}

module.exports = { sendPasswordSetupEmail };