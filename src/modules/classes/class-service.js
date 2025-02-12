const { ERROR_MESSAGES } = require("../../constants");
const { ApiError } = require("../../utils");
const {
  getAllClasses,
  getClassDetail,
  addNewClass,
  updateClassDetailById,
  updateClassStatus,
  getClassStructure,
  addSection,
  updateSection,
  updateSectionStatus,
  getAllClassTeachers,
  assignClassTeacher,
  getAllTeachersOfSchool,
} = require("./class-repository");

const fetchAllClasses = async (schoolId) => {
  const classes = await getAllClasses(schoolId);
  if (!Array.isArray(classes) || classes.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return { classes };
};

const fetchClassDetail = async ({ id, schoolId }) => {
  const classDetail = await getClassDetail({ id, schoolId });
  if (!classDetail) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return classDetail;
};

const addClass = async (payload) => {
  const affectedRow = await addNewClass(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to add new class");
  }
  return { message: "Class added successfully" };
};

const updateClassDetail = async (payload) => {
  const affectedRow = await updateClassDetailById(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to update class detail");
  }
  return { message: "Class detail updated successfully" };
};

const processUpdateClassStatus = async (payload) => {
  const affectedRow = await updateClassStatus(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to update class status");
  }
  return { message: "Class status updated successfully" };
};

const formatResponse = (data) =>
  Object.values(
    data.reduce((classData, item) => {
      const {
        id,
        sectionId,
        sectionName,
        sectionSortOrder,
        sectionStatus,
        ...rest
      } = item;

      if (!classData[id]) {
        classData[id] = {
          id,
          ...rest,
          sections: [],
        };
      }

      if (sectionId && sectionName) {
        classData[id].sections.push({
          id: sectionId,
          name: sectionName,
          sectionSortOrder,
          isActive: sectionStatus,
        });
      }

      return classData;
    }, {})
  )
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((classItem) => {
      classItem.sections.sort(
        (a, b) => a.sectionSortOrder - b.sectionSortOrder
      );
      return classItem;
    });

const processGetClassStructure = async (schoolId) => {
  const data = await getClassStructure(schoolId);
  if (!Array.isArray(data) || data.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }

  const classSectionStructure = formatResponse(data);
  return { classSectionStructure };
};

const processAddSection = async (payload) => {
  const affectedRow = await addSection(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to add new section");
  }
  return { message: "Section added successfully" };
};

const processUpdateSection = async (payload) => {
  const affectedRow = await updateSection(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to update section");
  }
  return { message: "Section updated successfully" };
};

const processUpdateSectionStatus = async (payload) => {
  const affectedRow = await updateSectionStatus(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to update section status");
  }
  return { message: "Section status updated successfully" };
};

const processGetAllClassTeachers = async (schoolId) => {
  const classTeachers = await getAllClassTeachers(schoolId);
  if (!Array.isArray(classTeachers) || classTeachers.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return { classTeachers };
};

const processAssignClassTeacher = async (schoolId) => {
  const affectedRow = await assignClassTeacher(schoolId);
  if (affectedRow <= 0) {
    throw new ApiError(404, "Unable to assign class teacher");
  }
  return { message: "Class Teacher assigned successfully" };
};

const processGetAllTeachersOfSchool = async (schoolId) => {
  const teachers = await getAllTeachersOfSchool(schoolId);
  if (!Array.isArray(teachers) || teachers.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return { teachers };
};

module.exports = {
  fetchAllClasses,
  fetchClassDetail,
  addClass,
  updateClassDetail,
  processUpdateClassStatus,
  processGetClassStructure,
  processAddSection,
  processUpdateSection,
  processUpdateSectionStatus,
  processGetAllClassTeachers,
  processAssignClassTeacher,
  processGetAllTeachersOfSchool,
};
