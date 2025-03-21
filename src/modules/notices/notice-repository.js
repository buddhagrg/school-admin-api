const processDBRequest = require("../../utils/process-db-request");

const getNotices = async (userId) => {
  const query = `SELECT * FROM get_notices($1)`;
  const queryParams = [userId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const getPendingNotices = async (schoolId) => {
  const query = `
    SELECT
      t1.id,
      t1.title,
      t1.description,
      t1.author_id AS "authorId",
      t1.created_date AS "createdDate",
      t1.updated_date AS "updatedDate",
      t2.name AS author,
      t4.name AS "reviewerName",
      t1.reviewed_date AS "reviewedDate",
      t3.alias AS "status",
      t1.notice_status_code AS "statusId",
      CASE
        WHEN t1.recipient_type = 'SP' THEN
          CASE
              WHEN t5.static_role_id = 3 THEN
                CASE
                  WHEN t1.recipient_first_field IS NULL THEN 'All Teachers'
                  ELSE 'Teachers from' || ' "' || t6.name || '" ' || 'department'
                END
              WHEN t5.static_role_id = 4 THEN
                CASE
                  WHEN t1.recipient_first_field IS NULL THEN 'All Students'
                  ELSE 'Students from' || ' "' || t7.name || '" ' || 'class'
                END
          ELSE 'Unknown Recipient'
          END
      ELSE 'Everyone'
      END AS "whoHasAccess"
    FROM notices t1
    LEFT JOIN users t2 ON t1.author_id = t2.id
    LEFT JOIN notice_status t3 ON t3.code = t1.notice_status_code
    LEFT JOIN users t4 ON t1.reviewer_id = t4.id
    LEFT JOIN roles t5 ON t5.id = t1.recipient_role_id
    LEFT JOIN departments t6 ON t6.id = t1.recipient_first_field
    LEFT JOIN classes t7 ON t7.id = t1.recipient_first_field
    WHERE t1.notice_status_code IN ('APPROVED', 'CANCELLED') AND t1.school_id = $1
  `;
  const queryParams = [schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const getNotice = async ({ noticeId, schoolId }) => {
  const query = `
    SELECT
      t1.id,
      t1.title,
      t1.description,
      t1.notice_status_code AS status,
      t1.author_id AS "authorId",
      t1.created_date AS "createdDate",
      t1.updated_date AS "updatedDate",
      t1.recipient_type AS "recipientType",
      t1.recipient_role_id AS "recipientRole",
      t1.recipient_first_field AS "firstField",
      t2.name AS author
    FROM notices t1
    LEFT JOIN users t2 ON t2.id = t1.author_id
    WHERE t1.id = $1 AND t1.school_id = $2
  `;
  const queryParams = [noticeId, schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};

const sanitizeInput = (value) => (value ? value : null);
const addNotice = async (payload) => {
  const now = new Date();
  const {
    title,
    status,
    description,
    recipientType,
    recipientRole,
    firstField: recipientFirstField,
    authorId,
    schoolId,
  } = payload;
  const query = `
    INSERT INTO notices
    (title, description, status, recipient_type, recipient_role_id, recipient_first_field, created_date, author_id, school_id)
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
    schoolId,
  ];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const updateNotice = async (payload) => {
  const now = new Date();
  const {
    id,
    title,
    status,
    description,
    recipientType,
    recipientRole,
    firstField,
    schoolId,
  } = payload;
  const query = `
    UPDATE notices
    SET
      title = $1,
      description = $2,
      status = $3,
      recipient_type = $4,
      recipient_role_id = $5,
      recipient_first_field = $6,
      updated_date = $7
    WHERE id = $8 AND school_id = $9
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
    schoolId,
  ];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const getNoticeRecipients = async (schoolId) => {
  try {
    const queries = [
      {
        query: `
          WITH data AS(
            SELECT id AS "roleId"
            FROM roles
            WHERE school_id = $1 AND static_role_id = $2
            LIMIT 1
          )
          SELECT t1.id, t1.name, t2."roleId"
          FROM departments t1
          RIGHT JOIN data t2 ON t1.school_id = $1
        `,
        staticRoleId: 3,
        roleName: "Teacher",
        dependentName: "Departments",
      },
      {
        query: `
        WITH data AS(
          SELECT id AS "roleId"
          FROM roles
          WHERE school_id = $1 AND static_role_id = $2
        )
        SELECT
        t1.id, t1.name, t2."roleId"
        FROM classes t1
        RIGHT JOIN data t2 ON t1.school_id = $1
      `,
        staticRoleId: 4,
        roleName: "Student",
        dependentName: "Classes",
      },
    ];

    const staticRecipients = queries.map(async (item) => {
      const { query, staticRoleId, roleName, dependentName } = item;
      const queryParams = [schoolId, staticRoleId];
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
              list: resultantRows.filter((r) => r.id),
            },
          }
        : [];
    });

    const staticResult = await Promise.all(staticRecipients);
    const dynamicQuery = `
      SELECT id, name, id AS "roleId"
      FROM roles
      WHERE school_id = $1 AND static_role_id NOT IN (1,2,3,4)
    `;
    const dynamicQueryParams = [schoolId];
    const { rows } = await processDBRequest({
      query: dynamicQuery,
      queryParams: dynamicQueryParams,
    });

    return [...staticResult, ...rows];
  } catch (error) {
    throw error;
  }
};

const updateNoticeStatus = async (payload) => {
  const { status, currentUserId, noticeId } = payload;
  const now = new Date();
  const query = `
    UPDATE notices
    SET
      status = $1,
      reviewed_date = $2,
      reviewer_id = $3
    WHERE id = $4
  `;
  const queryParams = [status, now, currentUserId, noticeId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

module.exports = {
  getNotice,
  addNotice,
  updateNotice,
  getNoticeRecipients,
  updateNoticeStatus,
  getNotices,
  getPendingNotices,
};
