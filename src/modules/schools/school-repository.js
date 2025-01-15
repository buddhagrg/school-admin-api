const processDBRequest = require("../../utils/process-db-request");

const getSchoolCommonQuery = `
  SELECT
    t1.school_id AS "schoolId",
    t1.name,
    t1.email,
    t1.phone,
    t2.name as "lastModifiedByName",
    t1.created_date AS "createdDate",
    t1.updated_date AS "updatedDate",
    t1.is_active AS "isActive",
    t1.is_email_verified AS "isEmailVerified",
    t1.calendar_type AS "calendarType",
    t1.pan
  FROM schools t1
  LEFT JOIN users t2 ON t2.id = t1.last_modified_by
  WHERE 1=1
`;

const addSchool = async (payload) => {
  const { name, email, phone, schoolId, userId, dateFormat, pan } = payload;
  const query = `
    INSERT INTO schools(name, email, phone, school_id, last_modified_by, date_format, pan)
    VALUES($1, $2, $3, $4, $5, $6, $7)
  `;
  const queryParams = [name, email, phone, schoolId, userId, dateFormat, pan];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const getAllSchools = async () => {
  const query = getSchoolCommonQuery;
  const { rows } = await processDBRequest({ query });
  return rows;
};

const getSchool = async (schoolId) => {
  const query = `${getSchoolCommonQuery} AND t1.school_id = $1`;
  const queryParams = [schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};

const updateSchool = async (payload) => {
  const now = new Date();
  const { name, email, phone, dateFormat, pan, schoolId, userId } = payload;
  const query = `
    UPDATE schools
    SET
        name = $1,
        email = $2,
        phone = $3,
        date_format = $4,
        pan = $5,
        last_modified_by = $6,
        updated_date = $7
    WHERE school_id = $8
    `;
  const queryParams = [
    name,
    email,
    phone,
    dateFormat,
    pan,
    userId,
    now,
    schoolId,
  ];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const deleteSchool = async (schoolId) => {
  const query = `DELETE FROM schools WHERE school_id = $1`;
  const queryParams = [schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

module.exports = {
  addSchool,
  getAllSchools,
  deleteSchool,
  updateSchool,
  getSchool,
};
