const expressAsyncHandler = require("express-async-handler");
const { processGetUsers } = require("./users-service");

const handleGetUsers = expressAsyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const query = req.query;
  const response = await processGetUsers({ ...query, schoolId });
  res.json(response);
});

module.exports = { handleGetUsers };
