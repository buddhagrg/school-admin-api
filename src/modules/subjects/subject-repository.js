import { processDBRequest } from '../../utils/process-db-request.js';

export const addSubject = async (payload) => {
  const { schoolId, name, classId, sectionId } = payload;
  const query = `INSERT INTO subjects(school_id, name, class_id, section_id) VALUES($1, $2, $3, $4)`;
  const queryParams = [schoolId, name, classId || null, sectionId || null];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

export const updateSubject = async (payload) => {
  const { schoolId, id, name } = payload;
  const query = `UPDATE subjects SET name = $1 WHERE id = $2 AND school_id = $3`;
  const queryParams = [name, id, schoolId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

export const deleteSubject = async (payload) => {
  const { id, schoolId } = payload;
  const query = 'DELETE FROM subjects WHERE id = $1 AND school_id = $2';
  const queryParams = [id, schoolId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

export const getAllSubjects = async (payload) => {
  const { schoolId, classId, sectionId } = payload;
  const query = `
    SELECT 
      id,
      name
    FROM subjects
    WHERE school_id = $1
      AND ($1 IS NULL OR class_id = $1)
      AND ($2 IS NULL OR section_id = $2)
  `;
  const queryParams = [schoolId, classId, sectionId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};
