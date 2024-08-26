const { promisify } = require("util");
const { transporter } = require("../config");

const sendMail = promisify(transporter.sendMail).bind(transporter);

module.exports = {
    sendMail
};