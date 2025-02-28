const { db } = require("../../config");
const { ERROR_MESSAGES } = require("../../constants");
const { ApiError, getSchoolId } = require("../../utils");
const {
  getAllSchools,
  getSchool,
  addSchool,
  updateSchool,
  deleteSchool,
} = require("./school-repository");

const processGetAllSchools = async () => {
  const schools = await getAllSchools();
  if (schools.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return { schools };
};

const processGetSchool = async (schoolId) => {
  const school = await getSchool(schoolId);
  if (!school) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return school;
};

const processAddSchool = async (payload) => {
  const client = await db.connect();
  try {
    const schoolId = await getSchoolId(client);
    const affectedRow = await addSchool({ ...payload, schoolId });
    if (affectedRow <= 0) {
      throw new ApiError(500, "Unable to add school");
    }
    return { message: "School added successfully" };
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};

const processUpdateSchool = async (payload) => {
  const affectedRow = await updateSchool(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to update school");
  }
  return { message: "School update successfully" };
};

const processDeleteSchool = async (schoolId) => {
  const affectedRow = await deleteSchool(schoolId);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to delete school");
  }
  return { message: "School delete successfully" };
};

module.exports = {
  processGetAllSchools,
  processAddSchool,
  processDeleteSchool,
  processUpdateSchool,
  processGetSchool,
};
