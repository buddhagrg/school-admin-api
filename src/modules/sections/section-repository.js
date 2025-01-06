const processDBRequest = require("../../utils/process-db-request");

const getAllSections = async (schoolId) => {
  const query = `
    SELECT
      t1.name AS "className",
	    JSON_AGG(
        JSON_BUILD_OBJECT(
          'id', t2.id,
          'name', t2.name
        )
      ) AS sections
    FROM classes t1
    LEFT JOIN sections t2 ON t2.class_id = t1.id
    WHERE t2.school_id = $1
      AND t2.is_active = $2
      AND t2.name IS NOT NULL
      AND t1.name IS NOT NULL
    GROUP BY t1.name
  `;
  const queryParams = [schoolId, true];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const addNewSection = async ({ sectionNames, schoolId, classId }) => {
  let queryParams = [];
  const insertValues = sectionNames
    .map((item, index) => {
      values.push(schoolId, classId, item);
      const offsetIndex = 3 * index;
      return `($${offsetIndex + 1}, $${offsetIndex + 1}, $${offsetIndex + 1})`;
    })
    .join(",");
  const query = `INSERT INTO sections(name, school_id, class_id) VALUES ${insertValues}`;
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const getSectionById = async ({ id, schoolId }) => {
  const query = "SELECT * FROM sections WHERE id = $1 AND school_id = $2";
  const queryParams = [id, schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};

const updateSectionById = async (payload) => {
  const { id, name, schoolId } = payload;
  const query = `
    UPDATE sections
      SET name = $1
    WHERE id = $2 AND school_id = $3
  `;
  const queryParams = [name, id, schoolId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const deleteSectionById = async ({ id, schoolId }) => {
  const query = `
    UPDATE sections SET is_active = $1
    WHERE id = $2 AND school_id = $3
  `;
  const queryParams = [false, id, schoolId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

module.exports = {
  getAllSections,
  getSectionById,
  updateSectionById,
  deleteSectionById,
  addNewSection,
};
