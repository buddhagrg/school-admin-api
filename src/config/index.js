const { corsPolicy } = require("./cors");
const { db } = require("./db");
const { env } = require("./env");
const { transporter } = require("./mailer");

module.exports = {
    cors: corsPolicy,
    db,
    env,
    transporter
};
