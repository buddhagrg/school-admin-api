import { processDBRequest } from '../../utils/process-db-request.js';

const getSchoolCommonQuery = `
  SELECT
    t1.id,
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

export const getAllSchools = async () => {
  const query = getSchoolCommonQuery;
  const { rows } = await processDBRequest({ query });
  return rows;
};

export const getSchool = async (schoolId) => {
  const query = `${getSchoolCommonQuery} AND t1.id = $1`;
  const queryParams = [schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};

export const updateSchool = async (payload) => {
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
    WHERE id = $8
  `;
  const queryParams = [name, email, phone, dateFormat, pan, userId, now, schoolId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

export const deleteSchool = async (schoolId) => {
  const query = `DELETE FROM schools WHERE id = $1`;
  const queryParams = [schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

export const getMySchool = async (schoolId) => {
  const query = `
    SELECT
      id,
      name,
      school_code AS code,
      email,
      phone,
      logo_url AS "logoUrl",
      pan,
      calendar_type AS "calendarType",
      established_year AS "establishedYear",
      motto,
      address,
      registration_number AS "registrationNumber",
      website_url AS "websiteUrl"
    FROM schools
    WHERE school_id = $1`;
  const queryParams = [schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};

export const updateMySchool = async (payload) => {
  const {
    schoolId,
    name,
    code,
    email,
    phone,
    pan,
    calendarType,
    establishedYear,
    motto,
    address,
    registrationNumber,
    websiteUrl
  } = payload;
  const query = `
  UPDATE schools
  SET
    name = $2,
    school_code = $3,
    email = $4,
    phone = $5,
    pan = $6,
    calendar_type = $7,
    established_year = $8,
    motto = $9,
    address = $10,
    registration_number = $11,
    website_url = $12
  WHERE school_id = $1`;
  const queryParams = [
    schoolId,
    name,
    code,
    email,
    phone,
    pan,
    calendarType,
    establishedYear,
    motto,
    address,
    registrationNumber,
    websiteUrl
  ];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};
