const { Pool } = require("pg");
const { env } = require("./env");

const db = new Pool({
    connectionString: env.databaseUrl
});

module.exports = { db };