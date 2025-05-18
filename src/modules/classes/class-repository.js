import { processDBRequest } from '../../utils/process-db-request.js';

export const addNewClass = async (payload) => {
  const { name, schoolId, academicLevelId, status } = payload;
  const query = `
    INSERT INTO classes (school_id, academic_level_id, name, is_active, sort_order)
    VALUES (
      $1,
      $2,
      $3,
      $4,
      (COALESCE((
        SELECT MAX(sort_order) FROM classes
        WHERE school_id = $1 AND academic_level_id = $2)
      , 0) + 1)
    )`;
  const queryParams = [schoolId, academicLevelId, name, status];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

export const updateClassDetailById = async (payload) => {
  const { id, name, schoolId, status } = payload;
  const query = `
    UPDATE classes
    SET name = $1, is_active = $2
    WHERE school_id = $3 AND id = $4
  `;
  const queryParams = [name, status, schoolId, id];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

export const getClassesWithSections = async (payload) => {
  const { schoolId, academicLevelId } = payload;
  let query = `
    SELECT
      t1.id,
      t1.name,
      t1.is_active AS "isActive",
      t1.academic_level_id AS "academicLevelId",
      t3.name AS "academicLevelName",
      t1.sort_order AS "sortOrder",
      t2.id AS "sectionId",
      t2.name AS "sectionName",
      t2.sort_order AS "sectionSortOrder",
      t2.is_active AS "sectionStatus"
    FROM classes t1
    LEFT JOIN sections t2 ON t2.class_id = t1.id
    LEFT JOIN academic_levels t3 ON t3.id = t1.academic_level_id
    WHERE t1.school_id = $1
  `;
  let queryParams = [schoolId];
  if (academicLevelId) {
    query += ` AND t1.academic_level_id = $${queryParams.length + 1}`;
    queryParams.push(academicLevelId);
  }
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

export const addSection = async (payload) => {
  const { name, schoolId, classId, status } = payload;
  const query = `
    INSERT INTO sections(school_id, class_id, name, is_active, sort_order)
    VALUES(
      $1,
      $2,
      $3,
      $4,
      (COALESCE((
        SELECT MAX(sort_order) FROM sections
        WHERE school_id = $1 AND class_id = $2)
      ,0) + 1)
    )`;
  const queryParams = [schoolId, classId, name, status];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

export const updateSection = async (payload) => {
  const { classId, sectionId, name, schoolId, status } = payload;
  const query = `
    UPDATE sections
    SET
      name = $1,
      is_active = $2,
      class_id = $3,
      sort_order = (COALESCE((
        SELECT MAX(sort_order) FROM sections
        WHERE school_id = $4 AND class_id = $3)
      ,0) + 1)
    WHERE school_id = $4 AND id = $5
  `;
  const queryParams = [name, status, classId, schoolId, sectionId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};
