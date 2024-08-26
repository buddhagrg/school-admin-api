const cors = require("cors");

const corsPolicy = cors({
    origin: "http://localhost:5173",
    method: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Accept", "Origin", "X-CSRF-TOKEN"],
    credentials: true,
});

module.exports = { corsPolicy };