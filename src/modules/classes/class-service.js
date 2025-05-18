import { ERROR_MESSAGES } from '../../constants/index.js';
import { ApiError } from '../../utils/index.js';
import {
  addNewClass,
  updateClassDetailById,
  getClassesWithSections,
  addSection,
  updateSection
} from './class-repository.js';

export const addClass = async (payload) => {
  const affectedRow = await addNewClass(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to add new class');
  }
  return { message: 'Class added successfully' };
};

export const updateClassDetail = async (payload) => {
  const affectedRow = await updateClassDetailById(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to update class detail');
  }
  return { message: 'Class detail updated successfully' };
};

const formatResponse = (data) =>
  Object.values(
    data.reduce((classData, item) => {
      const { id, sectionId, sectionName, sectionSortOrder, sectionStatus, ...rest } = item;
      if (!classData[id]) {
        classData[id] = {
          id,
          ...rest,
          sections: []
        };
      }
      if (sectionId && sectionName) {
        classData[id].sections.push({
          id: sectionId,
          name: sectionName,
          sectionSortOrder,
          isActive: sectionStatus
        });
      }
      return classData;
    }, {})
  )
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((classItem) => {
      classItem.sections.sort((a, b) => a.sectionSortOrder - b.sectionSortOrder);
      return classItem;
    });

export const processGetClassesWithSections = async (payload) => {
  const data = await getClassesWithSections(payload);
  if (!Array.isArray(data) || data.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  const classesWithSections = formatResponse(data);
  return { classesWithSections };
};

export const processAddSection = async (payload) => {
  const affectedRow = await addSection(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to add new section');
  }
  return { message: 'Section added successfully' };
};

export const processUpdateSection = async (payload) => {
  const affectedRow = await updateSection(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to update section');
  }
  return { message: 'Section updated successfully' };
};
