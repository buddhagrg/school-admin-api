const cors = require("cors");
const { env } = require("./env");

const corsPolicy = cors({
    origin: env.uiRoute,
    method: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Accept", "Origin", "X-CSRF-TOKEN"],
    credentials: true,
});

module.exports = { corsPolicy };