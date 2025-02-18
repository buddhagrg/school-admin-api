const asyncHandler = require("express-async-handler");
const {
  processGetUsers,
  processUpdateUserSystemAccess,
} = require("./users-service");

const handleGetUsers = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const query = req.query;
  const response = await processGetUsers({ ...query, schoolId });
  res.json(response);
});

const handleUpdateUserSystemAccess = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;
  const { id: reviewerId, schoolId } = req.user;
  const { hasSystemAccess } = req.body;
  const response = await processUpdateUserSystemAccess({
    userId,
    hasSystemAccess,
    reviewerId,
    schoolId,
  });
  res.json(response);
});

module.exports = { handleGetUsers, handleUpdateUserSystemAccess };
