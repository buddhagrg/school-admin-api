import { processDBRequest } from '../../utils/process-db-request.js';

export const getNotices = async (payload) => {
  const { userId, statusId, roleId, fromDate, toDate } = payload;
  const query = `
    SELECT *
    FROM get_notices (
      _user_id => $1,
      _role_id => $2,
      _status => $3,
      _from_date => $4,
      _to_date => $5
    )
  `;
  const queryParams = [userId, roleId, statusId, fromDate, toDate];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const sanitizeInput = (value) => (value ? value : null);

export const addNotice = async (payload) => {
  const now = new Date();
  const {
    title,
    status,
    description,
    recipientType,
    recipientRole,
    firstField: recipientFirstField,
    authorId,
    schoolId
  } = payload;
  const query = `
    INSERT INTO notices
    (title, description, notice_status_code, recipient_type, recipient_role_id, recipient_first_field, created_date, author_id, school_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
  `;
  const queryParams = [
    title,
    description,
    status,
    recipientType,
    sanitizeInput(recipientRole),
    sanitizeInput(recipientFirstField),
    now,
    authorId,
    schoolId
  ];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

export const updateNotice = async (payload) => {
  const now = new Date();
  const { id, title, status, description, recipientType, recipientRole, firstField, schoolId } =
    payload;
  const query = `
    UPDATE notices
    SET
      title = $1,
      description = $2,
      notice_status_code = $3,
      recipient_type = $4,
      recipient_role_id = $5,
      recipient_first_field = $6,
      updated_date = $7
    WHERE id = $8
      AND school_id = $9
      AND $3 IN ('DRAFT', 'PENDING')
  `;
  const queryParams = [
    title,
    description,
    status,
    recipientType,
    recipientRole,
    firstField,
    now,
    id,
    schoolId
  ];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

export const getNoticeRecipients = async (schoolId) => {
  try {
    const queries = [
      {
        query: `
          WITH data AS(
            SELECT id AS "roleId"
            FROM roles
            WHERE school_id = $1 AND static_role = $2
            LIMIT 1
          )
          SELECT t1.id, t1.name, t2."roleId"
          FROM departments t1
          RIGHT JOIN data t2 ON t1.school_id = $1
        `,
        staticRole: 'TEACHER',
        roleName: 'Teacher',
        dependentName: 'Departments'
      },
      {
        query: `
        WITH data AS(
          SELECT id AS "roleId"
          FROM roles
          WHERE school_id = $1 AND static_role = $2
        )
        SELECT
        t1.id, t1.name, t2."roleId"
        FROM classes t1
        RIGHT JOIN data t2 ON t1.school_id = $1
      `,
        staticRole: 'STUDENT',
        roleName: 'Student',
        dependentName: 'Classes'
      }
    ];
    const staticRecipients = queries.map(async (item) => {
      const { query, staticRole, roleName, dependentName } = item;
      const queryParams = [schoolId, staticRole];
      const { rows } = await processDBRequest({ query, queryParams });
      const resultantRows =
        rows.length > 0
          ? rows.map((row) => {
              const { roleId, ...rest } = row;
              return rest;
            })
          : [];
      return resultantRows.length > 0
        ? {
            id: rows[0].roleId,
            roleId: rows[0].roleId,
            name: roleName,
            primaryDependents: {
              name: dependentName,
              list: resultantRows.filter((r) => r.id)
            }
          }
        : [];
    });
    const staticResult = await Promise.all(staticRecipients);
    const dynamicQuery = `
      SELECT id, name, id AS "roleId"
      FROM roles
      WHERE school_id = $1 AND static_role NOT IN ('ADMIN', 'TEACHER', 'STUDENT')
    `;
    const dynamicQueryParams = [schoolId];
    const { rows } = await processDBRequest({
      query: dynamicQuery,
      queryParams: dynamicQueryParams
    });
    return [...staticResult, ...rows];
  } catch (error) {
    throw error;
  }
};

export const reviewNoticeStatus = async (payload) => {
  const { id, status, reviewerId, schoolId } = payload;
  const now = new Date();
  const query = `
    UPDATE notices
    SET
      notice_status_code = $1,
      reviewed_date = $2,
      reviewer_id = $3
    WHERE school_id = $4
      AND id = $5
      AND notice_status_code = 'PENDING'
      AND $1 IN ('APPROVED', 'REJECTED')
  `;
  const queryParams = [status, now, reviewerId, schoolId, id];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

export const deleteNotice = async (payload) => {
  const { schoolId, id } = payload;
  const query = `
    DELETE FROM notices
    WHERE school_id = $1 AND id = $2
  `;
  const queryParams = [schoolId, id];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

export const publishNotice = async (payload) => {
  const { schoolId, id } = payload;
  const now = new Date();
  const query = `
    UPDATE notices
    SET
      notice_status_code = 'PUBLISHED',
      published_date = $1
    WHERE school_id = $2
      AND id = $3
      AND notice_status_code = 'APPROVED'
  `;
  const queryParams = [now, schoolId, id];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};
