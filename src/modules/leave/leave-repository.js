import { processDBRequest } from '../../utils/process-db-request.js';

const leaveRequestCommonQuery = `
  SELECT
    t1.id,
    t2.name as policy,
    t1.leave_policy_id AS "policyId",
    t1.from_date AS "fromDate",
    t1.to_date AS "toDate",
    t1.note,
    t1.leave_status_code AS "statusId",
    t3.name AS status,
    t1.submitted_date AS "submittedDate",
    t1.updated_date AS "updatedDate",
    t1.reviewed_date AS "reviewedDate",
    t4.name AS reviewer,
    t5.name AS user,
    t1.reviewer_note AS "reviewerNote",
    EXTRACT(DAY FROM age(t1.to_date +  INTERVAL '1 day', t1.from_date)) AS duration
  FROM user_leaves t1
  JOIN leave_policies t2 ON t1.leave_policy_id = t2.id
  JOIN leave_status t3 ON t3.code = t1.leave_status_code
  LEFT JOIN users t4 ON t1.reviewer_id = t4.id
  JOIN users t5 ON t1.user_id = t5.id
  WHERE t1.school_id = $1
`;

export const addNewLeavePolicy = async (payload) => {
  const { name, schoolId, isActive } = payload;
  const query = 'INSERT INTO leave_policies (name, school_id, is_active) VALUES ($1, $2, $3)';
  const queryParams = [name, schoolId, isActive];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

export const updateLeavePolicy = async (payload) => {
  const { name, id, schoolId, isActive } = payload;
  const query = `
    UPDATE leave_policies
    SET name = $1, is_active = $2
    WHERE id = $3 AND school_id = $4
  `;
  const queryParams = [name, isActive, id, schoolId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

export const getLeavePolicies = async (schoolId) => {
  const query = `
    SELECT
      t1.id,
      t1.name,
      t1.is_active AS "isActive",
      COUNT(t2.user_id) AS "totalUsersAssociated"
    FROM leave_policies t1
    LEFT JOIN user_leave_policy t2 ON t1.id = t2.leave_policy_id
    WHERE t1.school_id = $1
    GROUP BY t1.id, t1.name, t1.is_active
  `;
  const queryParams = [schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

export const getMyLeavePolicy = async (payload) => {
  const { id, schoolId } = payload;
  const query = `
    SELECT
      t2.id,
      t2.name,
      COALESCE(SUM(
        CASE WHEN t3.leave_status_code = 'APPROVED' THEN
            (t3.to_date - t3.from_date) + 1
        ELSE 0
        END
      ), 0) AS "daysUsed"
    FROM user_leave_policy t1
    JOIN leave_policies t2 ON t1.leave_policy_id = t2.id
    LEFT JOIN user_leaves t3 ON t3.leave_policy_id = t1.leave_policy_id
    WHERE t1.user_id = $1 AND t1.school_id = $2
    GROUP BY t2.id, t2.name
  `;
  const queryParams = [id, schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

export const getPolicyUsers = async (payload) => {
  const { id, schoolId } = payload;
  const query = `
    SELECT
      t2.id,
      t2.name,
      t4.name AS role,
      COALESCE(SUM(
        CASE
          WHEN t3.leave_status_code = 'APPROVED' THEN
              EXTRACT(DAY FROM age(t3.to_date + INTERVAL '1 day', t3.from_date))
          ELSE 0
        END
      ), 0) AS "totalDaysUsed"
    FROM user_leave_policy t1
    LEFT JOIN users t2 ON t1.user_id = t2.id
    LEFT JOIN user_leaves t3 ON t3.leave_policy_id = t1.leave_policy_id AND t3.user_id = t1.user_id
    LEFT JOIN roles t4 ON t4.id = t2.role_id
    WHERE t1.leave_policy_id = $1 AND t2.school_id = $2
    GROUP BY t2.id, t2.name, t4.name`;
  const queryParams = [id, schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

export const linkPolicyUsers = async (payload) => {
  const { policyId, users, schoolId } = payload;
  const _users = users.split(',').map((user) => Number(user.trim()));
  const query = `
    INSERT INTO user_leave_policy(user_id, leave_policy_id, school_id)
    SELECT UNNEST($1::int[]), $2::int, $3
    ON CONFLICT (user_id, leave_policy_id, school_id) DO NOTHING
  `;
  const queryParams = [_users, Number(policyId), schoolId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

export const updateLeavePolicyStatus = async (payload) => {
  const { status, policyId, schoolId } = payload;
  const query = `UPDATE leave_policies SET is_active = $1::boolean WHERE id = $2 AND school_id = $3`;
  const queryParams = [status, policyId, schoolId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

export const unlinkPolicyUser = async (payload) => {
  const { userId, id, schoolId } = payload;
  const query = `
  DELETE FROM user_leave_policy
  WHERE user_id = $1
    AND leave_policy_id = $2
    AND school_id = $3`;
  const queryParams = [userId, id, schoolId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

export const getPolicyEligibleUsers = async (schoolId) => {
  const query = `
  SELECT t1.id, t1.name
  FROM users t1
  JOIN roles t2 ON t2.id = t1.role_id
  WHERE t1.school_id = $1
    AND t2.static_role NOT IN('ADMIN')
  `;
  const queryParams = [schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

export const addNewLeaveRequest = async (payload) => {
  const now = new Date();
  const leaveRequestStatus = 'PENDING';
  const { policyId, from, to, note, userId, schoolId } = payload;
  const query = `
    INSERT INTO user_leaves
    (school_id, user_id, leave_policy_id, from_date, to_date, note, submitted_date, leave_status_code, academic_year_id)
    SELECT
      $1, $2, $3, $4, $5, $6, $7, $8,
      (SELECT id FROM academic_years WHERE school_id = $1 AND is_active = true)
    WHERE EXISTS (
      SELECT 1 FROM user_leave_policy
      WHERE school_id = $1
        AND user_id = $2
        AND leave_policy_id = $3
    )
  `;
  const queryParams = [schoolId, userId, policyId, from, to, note, now, leaveRequestStatus];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

export const updateLeaveRequest = async (payload) => {
  const { id, policyId, fromDate, toDate, note, schoolId } = payload;
  const now = new Date();
  const query = `
    UPDATE user_leaves
    SET
      leave_policy_id = $1,
      from_date = $2,
      to_date = $3,
      note = $4,
      updated_date = $5
    WHERE
      leave_status_code = 'PENDING'
      AND id = $6
      AND school_id = $7
      AND ($2::date BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '2 months')::date);
  `;
  const queryParams = [policyId, fromDate, toDate, note, now, id, schoolId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

export const getUserLeaveHistory = async (payload) => {
  const { userId, schoolId, policyId, statusId, fromDate, toDate } = payload;
  let query = leaveRequestCommonQuery;
  query += ` AND t1.user_id = $2
    AND (
      t1.from_date BETWEEN $3 AND $4
      OR t1.to_date BETWEEN $3 AND $4
    )`;
  let queryParams = [schoolId, userId, fromDate, toDate];
  if (policyId) {
    query += ` AND t1.leave_policy_id = $${queryParams.length + 1}`;
    queryParams.push(policyId);
  }
  if (statusId) {
    query += ` AND t1.leave_status_code = $${queryParams.length + 1}`;
    queryParams.push(statusId);
  }
  query += ` ORDER BY t1.from_date`;
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

export const deleteLeaveRequest = async ({ payload, client }) => {
  const { id, schoolId } = payload;
  const query = `
    DELETE FROM user_leaves
    WHERE school_id = $1
      AND id = $2
      AND from_date > now()::date;
  `;
  const queryParams = [schoolId, id];
  const { rowCount } = await processDBRequest({ query, queryParams, client });
  return rowCount;
};

export const deleteAttendanceRecord = async ({ payload, client }) => {
  const { schoolId, id } = payload;
  const query = `
    DELETE FROM attendances
    WHERE school_id = $1 
      AND user_leave_id = $2
      AND attendance_date > now()::date
  `;
  const queryParams = [schoolId, id];
  await processDBRequest({ query, queryParams, client });
};

export const getPendingLeaveRequests = async (schoolId) => {
  let query = leaveRequestCommonQuery;
  query += `
    AND t1.leave_status_code = 'PENDING'
    ORDER BY t1.from_date
  `;
  const queryParams = [schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

export const updatePendingLeaveRequestStatus = async ({ payload, client }) => {
  const { reviewerUserId, requestId, status, schoolId, rejectionReason } = payload;
  const now = new Date();
  const query = `
    UPDATE user_leaves
    SET
      leave_status_code = $1,
      reviewed_date = $2,
      reviewer_id = $3,
      reviewer_note = $4
    WHERE leave_status_code = 'PENDING' AND id = $5 AND school_id = $6
    RETURNING *
  `;
  const queryParams = [status, now, reviewerUserId, rejectionReason, requestId, schoolId];
  const { rows } = await processDBRequest({ query, queryParams, client });
  return rows[0];
};

export const getUserWithLeavePolicies = async (payload) => {
  const { schoolId, userId } = payload;
  const query = `
  With leave_policies AS(
    SELECT
      t2.id,
      t2.name,
      NULL AS icon,
      true AS "isActive",
      NULL AS "totalUsersAssociated"
    FROM user_leave_policy t1
    JOIN leave_policies t2 ON t2.id = t1.leave_policy_id
    WHERE t2.is_active = true
      AND t1.school_id = $1
      AND t1.user_id = $2  
  ),
  leave_history AS(
    SELECT
      t1.id,
      t3.name,
      t1.from_date AS "dateFrom",
      t1.to_date AS "dateTo",
      t2.name as status,
      EXTRACT(DAY FROM AGE(t1.to_date + INTERVAL '1 day', t1.from_date)) AS days
    FROM user_leaves t1
    JOIN leave_status t2 ON t2.code = t1.leave_status_code
    JOIN leave_policies t3 ON t3.id = t1.leave_policy_id
    WHERE t1.to_date >= NOW()::date
    ORDER BY from_date ASC
    LIMIT 3
  ),
  user_detail AS(
    SELECT
      t1.id,
      t1.name,
      t1.email,
      t3.current_address AS "currentAddress",
      t3.phone,
      t2.name AS role
    FROM users t1
    JOIN roles t2 ON t2.id = t1.role_id
    JOIN user_profiles t3 ON t3.user_id = t1.id
    WHERE t1.school_id = $1 AND t1.id = $2
  )

  SELECT
    COALESCE((SELECT row_to_json(user_detail) FROM user_detail), '{}'::json) AS user,
    COALESCE((SELECT json_agg(leave_policies) FROM leave_policies), '[]'::json) AS "leavePolicies",
    COALESCE((SELECT json_agg(leave_history) FROM leave_history), '[]'::json) AS "leaveHistory"
  `;
  const queryParams = [schoolId, userId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};

export const insertUserLeave = async ({ payload, client }) => {
  const { schoolId, userId, note, from, to, reviewerId, policyId } = payload;
  const now = new Date();
  const leaveRequestStatus = 'APPROVED';
  const query = `
    INSERT INTO user_leaves
    (school_id, user_id, leave_policy_id, from_date, to_date, note, submitted_date, reviewed_date, leave_status_code, reviewer_id, academic_year_id)
    SELECT
      $1, $2, $3, $4, $5, $6, $7, $7, $8, $9,
      (SELECT id FROM academic_years WHERE school_id = $1 AND is_active = true)
      WHERE EXISTS(
        SELECT 1 FROM user_leave_policy
        WHERE school_id = $1
          AND user_id = $2
          AND leave_policy_id = $3
      )
      AND NOT EXISTS(
        SELECT 1 FROM user_leaves
        WHERE school_id = $1
          AND user_id = $2
          AND (
            ($4 BETWEEN from_date AND to_date)
            OR ($5 BETWEEN from_date AND to_date)
          )
      )
    RETURNING id;
  `;
  const queryParams = [
    schoolId,
    userId,
    policyId,
    from,
    to,
    note,
    now,
    leaveRequestStatus,
    reviewerId
  ];
  const { rows } = await processDBRequest({ query, queryParams, client });
  return rows[0].id;
};

export const insertUserAttendance = async ({ payload, client }) => {
  const { schoolId, userId, note, from, to, reviewerId, userLeaveId } = payload;
  const attendanceStatus = 'ON_LEAVE';
  const query = `
    INSERT INTO attendances
    (school_id, academic_year_id, user_id, user_leave_id, attendance_status_code, remarks, attendance_recorder, attendance_date)
    SELECT $1,
      (SELECT id FROM academic_years WHERE school_id = $1 AND is_active = true),
      $2, $3, $4, $5, $6, gs.date
    FROM generate_series($7::date, $8::date, '1 day'::interval) AS gs(date)
    ON CONFLICT(school_id, academic_year_id, user_id, attendance_date)
    DO UPDATE
    SET
      attendance_status_code = EXCLUDED.attendance_status_code,
      attendance_recorder = EXCLUDED.attendance_recorder,
      remarks = EXCLUDED.remarks,
      updated_date = now(),
      user_leave_id = EXCLUDED.user_leave_id;
  `;
  const queryParams = [schoolId, userId, userLeaveId, attendanceStatus, note, reviewerId, from, to];
  await processDBRequest({ query, queryParams, client });
};
