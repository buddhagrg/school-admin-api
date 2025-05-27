import { assertRowCount, handleArryResponse } from '../../utils/index.js';
import {
  addNewClass,
  updateClassDetailById,
  getClassesWithSections,
  addSection,
  updateSection
} from './class-repository.js';
import { CLASS_MESSAGES, SECTION_MESSAGES } from './class-messages.js';

export const addClass = async (payload) => {
  await assertRowCount(addNewClass(payload), CLASS_MESSAGES.ADD_CLASS_FAIL);
  return { message: CLASS_MESSAGES.ADD_CLASS_SUCCESS };
};

export const updateClassDetail = async (payload) => {
  await assertRowCount(updateClassDetailById(payload), CLASS_MESSAGES.UPDATE_CLASS_FAIL);
  return { message: CLASS_MESSAGES.UPDATE_CLASS_SUCCESS };
};

export const processAddSection = async (payload) => {
  await assertRowCount(addSection(payload), SECTION_MESSAGES.ADD_SECTION_FAIL);
  return { message: SECTION_MESSAGES.ADD_SECTION_SUCCESS };
};

export const processUpdateSection = async (payload) => {
  await assertRowCount(updateSection(payload), SECTION_MESSAGES.UPDATE_SECTION_FAIL);
  return { message: SECTION_MESSAGES.UPDATE_SECTION_SUCCESS };
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
  return handleArryResponse(() => getClassesWithSections(payload), 'classesWithSections', formatResponse);
};
