const { ERROR_MESSAGES } = require("../../constants");
const { ApiError } = require("../../utils");
const {
  getAllSections,
  getSectionById,
  updateSectionById,
  deleteSectionById,
  addNewSection,
} = require("./section-repository");

const processGetAllSections = async (schoolId) => {
  const sections = await getAllSections(schoolId);
  if (sections.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }

  return sections;
};

const processAddNewSection = async (payload) => {
  const affectedRow = await addNewSection(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to add new section");
  }

  return { message: "Section added successfully" };
};

const processGetSectionById = async (payload) => {
  const section = await getSectionById(payload);
  if (!section) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }

  return section;
};

const processUpdateSectionById = async (payload) => {
  const affectedRow = await updateSectionById(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to update section detail");
  }

  return { message: "Section updated successfully" };
};

const processDeleteSectionById = async (payload) => {
  const affectedRow = await deleteSectionById(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to delete section detail");
  }

  return { message: "Section deleted successfully" };
};
module.exports = {
  processGetAllSections,
  processGetSectionById,
  processUpdateSectionById,
  processDeleteSectionById,
  processAddNewSection,
};
