const { db } = require("../../config");
const { ApiError, getSchoolId } = require("../../utils");
const {
  getAllSchools,
  addSchool,
  deleteSchool,
  updateSchool,
  addAccessControl,
  updateAccessControl,
  deleteAccessControl,
  getSchool,
} = require("./admin-repository");

const processGetAllSchools = async () => {
  const schools = await getAllSchools();
  if (schools.length <= 0) {
    throw new ApiError(404, "Schools not found");
  }

  return schools;
};

const processGetSchool = async (schoolId) => {
  const school = await getSchool(schoolId);
  if (!school) {
    throw new ApiError(404, "School not found");
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

const processAddAccessControl = async (payload) => {
  const affectedRow = await addAccessControl(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to add access control");
  }

  return { message: "New access control added successfully" };
};

const processUpdateAccessContorl = async (payload) => {
  const affectedRow = await updateAccessControl(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to update access control");
  }

  return { message: "Access control updated successfully" };
};

const processDeleteAccessControl = async (id) => {
  const affectedRow = await deleteAccessControl(id);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unabe to delete access control");
  }

  return { message: "Access control deleted successfully" };
};

module.exports = {
  processGetAllSchools,
  processAddSchool,
  processDeleteSchool,
  processUpdateSchool,
  processAddAccessControl,
  processUpdateAccessContorl,
  processDeleteAccessControl,
  processGetSchool,
};
