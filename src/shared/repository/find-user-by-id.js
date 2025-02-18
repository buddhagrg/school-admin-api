const processDBRequest = require("../../utils/process-db-request");

const findUserById = async (id) => {
  const query = `
    SELECT
      id,
      email,
      role_id,
      password,
      has_system_access,
      is_email_verified
    FROM users where id = $1`;
  const queryParams = [id];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};

module.exports = { findUserById };
