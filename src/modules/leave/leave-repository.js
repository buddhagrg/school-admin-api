const processDBRequest = require("../../utils/process-db-request");

const addNewLeavePolicy = async (payload) => {
  const { name, schoolId } = payload;
  const query = "INSERT INTO leave_policies (name, school_id) VALUES ($1, $2)";
  const queryParams = [name, schoolId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const updateLeavePolicy = async (payload) => {
  const { name, id, schoolId } = payload;
  const query = `
    UPDATE leave_policies
    SET name = $1
    WHERE id = $2 AND school_id = $3
  `;
  const queryParams = [name, id, schoolId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const getLeavePolicies = async (schoolId) => {
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

const getMyLeavePolicy = async (payload) => {
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
      ), 0) AS "totalDaysUsed"
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

const getPolicyUsers = async (payload) => {
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

const linkPolicyUsers = async (payload) => {
  const { policyId, users, schoolId } = payload;
  const _users = users.split(",").map((user) => Number(user.trim()));
  const query = `
    INSERT INTO user_leave_policy(user_id, leave_policy_id, school_id)
    SELECT UNNEST($1::int[]), $2::int, $3
    ON CONFLICT (user_id, leave_policy_id, school_id) DO NOTHING
  `;
  const queryParams = [_users, Number(policyId), schoolId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const updateLeavePolicyStatus = async (payload) => {
  const { status, policyId, schoolId } = payload;
  const query = `UPDATE leave_policies SET is_active = $1::boolean WHERE id = $2 AND school_id = $3`;
  const queryParams = [status, policyId, schoolId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const unlinkPolicyUser = async (payload) => {
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

const getPolicyEligibleUsers = async (schoolId) => {
  const query = `
  SELECT t1.id, t1.name
  FROM users t1
  JOIN roles t2 ON t2.id = t1.role_id
  WHERE t1.school_id = $1
    AND t2.static_role_id NOT IN(1, 2, 5)
  `;
  const queryParams = [schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const addNewLeaveRequest = async (payload) => {
  const now = new Date();
  const leaveRequestStatus = "REVIEW_REQUEST";
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
  const queryParams = [
    schoolId,
    userId,
    policyId,
    from,
    to,
    note,
    now,
    leaveRequestStatus,
  ];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const updateLeaveRequest = async (payload) => {
  const { id, policyId, from, to, note, schoolId } = payload;
  const LEAVE_STATUS_ON_REVIEW = "REVIEW_REQUEST";
  const now = new Date();
  const query = `
    UPDATE user_leaves
    SET
      leave_policy_id = $1,
      from_date = $2,
      to_date = $3,
      note = $4,
      updated_date = $5,
      leave_status_code = $6
    WHERE id = $7
      AND school_id = $8
      AND from_date > now();
  `;
  const queryParams = [
    policyId,
    from,
    to,
    note,
    now,
    LEAVE_STATUS_ON_REVIEW,
    id,
    schoolId,
  ];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const getUserLeaveHistory = async (payload) => {
  const { id, schoolId } = payload;
  const query = `
    SELECT
      t1.id,
      t2.name as policy,
      t1.leave_policy_id AS "policyId",
      t1.from_date AS "from",
      t1.to_date AS "to",
      t1.note,
      t1.leave_status_code AS "statusId",
      t3.name AS status,
      t1.submitted_date AS "submitted",
      t1.updated_date AS "updated",
      t1.approved_date AS "approved",
      t4.name AS approver,
      t5.name AS user,
      EXTRACT(DAY FROM age(t1.to_date +  INTERVAL '1 day', t1.from_date)) AS days
    FROM user_leaves t1
    JOIN leave_policies t2 ON t1.leave_policy_id = t2.id
    JOIN leave_status t3 ON t3.code = t1.leave_status_code
    LEFT JOIN users t4 ON t1.approver_id = t4.id
    JOIN users t5 ON t1.user_id = t5.id
    WHERE t1.user_id = $1 and t1.school_id = $2
    ORDER BY submitted_date DESC
  `;
  const queryParams = [id, schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const deleteLeaveRequest = async ({ payload, client }) => {
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

const deleteAttendanceRecord = async ({ payload, client }) => {
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

const getPendingLeaveRequests = async (schoolId) => {
  const LEAVE_STATUS_ON_REVIEW = "REVIEW_REQUEST";
  const query = `
    SELECT
      t1.id,
      t2.name as policy,
      t1.leave_policy_id AS "policyId",
      t1.from_date AS "from",
      t1.to_date AS "to",
      t1.note,
      t1.submitted_date AS "submitted",
      t1.updated_date AS "updated",
      t3.name AS user,
      EXTRACT(DAY FROM age(t1.to_date + INTERVAL '1 day', t1.from_date)) AS days
    FROM user_leaves t1
    JOIN leave_policies t2 ON t2.id = t1.leave_policy_id
    JOIN users t3 ON t3.id = t1.user_id
    WHERE t1.leave_status_code = $1 AND t1.school_id = $2
    ORDER BY submitted_date DESC
  `;
  const queryParams = [LEAVE_STATUS_ON_REVIEW, schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const updatePendingLeaveRequestStatus = async ({ payload, client }) => {
  const { reviewerUserId, requestId, status, schoolId } = payload;
  const now = new Date();
  const query = `
    UPDATE user_leaves
    SET
      leave_status_code = $1,
      approved_date = $2,
      approver_id = $3
    WHERE id = $4 AND school_id = $5
    RETURNING *
  `;
  const queryParams = [status, now, reviewerUserId, requestId, schoolId];
  const { rows } = await processDBRequest({ query, queryParams, client });
  return rows[0];
};

const findLeaveRequestReviewer = async (requestId) => {
  const query = `
    SELECT u.reporter_id
    FROM users u
    JOIN user_leaves ul ON u.id = ul.user_id
    WHERE ul.id = $1
  `;
  const { rows } = await processDBRequest({ query, queryParams: [requestId] });
  return rows[0];
};

const getUserWithLeavePolicies = async (payload) => {
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

const insertUserLeave = async ({ payload, client }) => {
  const { schoolId, userId, note, from, to, approverId, policyId } = payload;
  const now = new Date();
  const leaveRequestStatus = "APPROVED";
  const query = `
    INSERT INTO user_leaves
    (school_id, user_id, leave_policy_id, from_date, to_date, note, submitted_date, approved_date, leave_status_code, approver_id, academic_year_id)
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
    approverId,
  ];
  const { rows } = await processDBRequest({ query, queryParams, client });
  return rows[0].id;
};

const insertUserAttendance = async ({ payload, client }) => {
  const { schoolId, userId, note, from, to, approverId, userLeaveId } = payload;
  const attendanceStatus = "ON_LEAVE";
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
  const queryParams = [
    schoolId,
    userId,
    userLeaveId,
    attendanceStatus,
    note,
    approverId,
    from,
    to,
  ];
  await processDBRequest({ query, queryParams, client });
};

module.exports = {
  addNewLeavePolicy,
  updateLeavePolicy,
  getLeavePolicies,
  getPolicyUsers,
  linkPolicyUsers,
  updateLeavePolicyStatus,
  unlinkPolicyUser,
  getPolicyEligibleUsers,
  addNewLeaveRequest,
  updateLeaveRequest,
  getUserLeaveHistory,
  deleteLeaveRequest,
  getPendingLeaveRequests,
  updatePendingLeaveRequestStatus,
  findLeaveRequestReviewer,
  getMyLeavePolicy,
  getUserWithLeavePolicies,
  insertUserLeave,
  insertUserAttendance,
  deleteAttendanceRecord,
};
