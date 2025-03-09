const processDBRequest = require("../../utils/process-db-request");
const { format } = require("date-fns");

const userAttendanceListQuery = `
  SELECT
    t1.id,
    t1.name,
    t4.code AS "attendanceStatusCode",
    t4.description AS "attendanceStatus",
    t3.remarks
  FROM users t1
  JOIN roles r ON r.id = t1.role_id AND r.static_role_id NOT IN (1,2)
  LEFT JOIN user_profiles t2 ON t2.user_id = t1.id
  LEFT JOIN attendances t3
    ON t3.user_id = t1.id
    AND t3.academic_year_id = (SELECT id FROM academic_years WHERE school_id = $1 AND is_active = true)
    AND t3.attendance_date = $2
  LEFT JOIN attendance_status t4 ON t4.code = t3.attendance_status_code
`;

const getStudentsForAttendance = async (payload) => {
  const now = format(new Date(), "yyyy-MM-dd");
  const { classId, sectionId, name, schoolId } = payload;
  const _sectionId = sectionId ? Number(sectionId) : null;
  const _name = typeof name === "string" ? name : null;
  const query = `${userAttendanceListQuery}
    WHERE r.static_role_id = 4
      AND t1.school_id = $1
      AND t2.class_id = $3
      AND ($4::int IS NULL OR t2.section_id = $4::int)
      AND ($5::text IS NULL OR t1.name ILIKE $5::text || '%')
    ORDER BY t1.name
  `;
  const queryParams = [schoolId, now, classId, _sectionId, _name];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const getStaffForAttendance = async (payload) => {
  const now = format(new Date(), "yyyy-MM-dd");
  const { schoolId, roleId, name } = payload;
  const _roleId = roleId ? Number(roleId) : null;
  const _name = typeof name === "string" ? name : null;
  const query = `${userAttendanceListQuery}
    WHERE r.static_role_id != 4
      AND t1.school_id = $1
      AND ($3::int IS NULL OR t1.role_id = $3::int)
      AND ($4::text IS NULL OR t1.name ILIKE $4::text || '%')
    ORDER BY t1.name
  `;
  const queryParams = [schoolId, now, _roleId, _name];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const recordAttendance = async (payload) => {
  const now = format(new Date(), "yyyy-MM-dd");
  const { schoolId, attendances, attendanceRecorder } = payload;

  const query = `
  INSERT INTO attendances(
    school_id,
    academic_year_id,
    user_id,
    attendance_status_code,
    remarks,
    attendance_date,
    attendance_recorder
  )
    SELECT
      $1,
      (SELECT id FROM academic_years WHERE school_id = $1 AND is_active = true LIMIT 1),
      (t->> 'id')::int,
      (t->> 'status')::char(2),
      (t->> 'remarks')::text,
      $2,
      $3
    FROM jsonb_array_elements($4::jsonb) AS t  
    ON CONFLICT(school_id, academic_year_id, user_id, attendance_date)
    DO UPDATE SET
      attendance_status_code = EXCLUDED.attendance_status_code,
      remarks = EXCLUDED.remarks;
  `;
  const queryParams = [
    schoolId,
    now,
    attendanceRecorder,
    JSON.stringify(attendances),
  ];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const getStudentSubjectWiseAttendanceRecord = async (payload) => {
  const { dateFrom, dateTo, schoolId, classId, sectionId, academicYearId } =
    payload;
  const query = `
    WITH subject_attendance AS(
      SELECT
        t1.user_id AS user_id,
        t2.name AS subject_name,
        COUNT(DISTINCT t1.attendance_date) AS periods_taught,
        COALESCE(
          COUNT(
            CASE WHEN t1.attendance_type = 'S' AND t5.code = 'PR'
              THEN 1
            END
          ),0) AS periods_present
      FROM attendances t1
      JOIN subjects t2 ON t2.id = t1.subject_id
      JOIN users t3 ON t3.id = t1.user_id
      JOIN user_profiles t4 ON t4.user_id = t1.user_id
      JOIN attendance_status t5 ON t5.code = t1.attendance_status_code
      JOIN roles t6 ON t6.id = t3.role_id
      WHERE t1.school_id = $1
        AND t6.static_role_id = 4
        AND t1.class_id = $2
        AND ($3 IS NULL OR t1.section_id = $3)
        AND t1.attendance_date BETWEEN $4 AND $5
        AND t1.academic_year_id = $6
      GROUP BY t1.user_id, t2.name
  ),

  total_attendance AS(
    SELECT
      t1.user_id AS user_id,
      COUNT(DISTINCT t1.id) AS periods_taught,
      COALESCE(
        SUM(
          CASE WHEN t1.attendance_type = 'S' AND t5.code = 'PR'
            THEN 1
          ELSE 0
          END
        ),0) AS periods_present
    FROM attendances t1
    JOIN subjects t2 ON t2.id = t1.subject_id
    JOIN users t3 ON t3.id = t1.user_id
    JOIN user_profiles t4 ON t4.user_id = t1.user_id
    JOIN attendance_status t5 ON t5.code = t1.attendance_status_code
    JOIN roles t6 ON t6.id = t3.role_id
    WHERE t1.school_id = $1
      AND t6.static_role_id = 4
      AND t1.class_id = $2
      AND ($3 IS NULL OR t1.section_id = $3)
      AND t1.attendance_date BETWEEN $4 AND $5
      AND t1.academic_year_id = $6
    GROUP BY t1.user_id
  )

  SELECT
    t1.id AS "userId",
    t1.name AS "userName",
    t2.roll AS "userRoll",
    JSON_AGG(
      JSON_BUILD_OBJECT(
        'name', t3.subject_name,
        'total', t3.periods_taught,
        'present', COALESCE(t3.present,0)
      )
    ) AS "subjectWiseAttendance",
    JSON_BUILD_OBJECT(
      'totalOperatingPeriod', t4.total_operating_period,
      'totalPresent', t4.total_present
    ) AS "totalPeriodAttendance"
  FROM users t1
  JOIN user_profiles t2 ON t2.user_id = t1.id
  JOIN subject_attendance t3 ON t3.user_id = t1.id
  JOIN total_attendance t4 ON t4.user_id = t1.id
  GROUP BY t1.id, t2.roll, t1.name, t4.total_operating_period, t4.total_present;
  `;
  const queryParams = [
    schoolId,
    classId,
    sectionId,
    dateFrom,
    dateTo,
    academicYearId,
  ];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const attendanceRecordQuery = `
  SELECT
    t2.id,
    t2.name,
    COUNT(DISTINCT t1.attendance_date) AS "totalOperatingDays",
    COUNT(CASE WHEN t4.code = 'PR' THEN 1 ELSE NULL END) AS "totalPresentDays"
  FROM attendances t1
  JOIN users t2 ON t2.id = t1.user_id
  LEFT JOIN attendance_status t4 ON t4.code = t1.attendance_status_code
`;

const getStudentDailyAttendanceRecord = async (payload) => {
  const {
    dateFrom,
    dateTo,
    schoolId,
    classId,
    sectionId,
    name,
    academicYearId,
  } = payload;
  const query = `${attendanceRecordQuery}
    JOIN user_profiles t3 ON t3.user_id = t2.id
    JOIN roles t5 ON t5.id = t2.role_id
    JOIN classes t6 ON t6.id = t3.class_id
    JOIN sections t7 ON t7.id = t3.section_id
    WHERE t1.attendance_type = 'D'
      AND t5.static_role_id = 4
      AND t1.school_id = $1
      AND t1.academic_year_id = $2
      AND ($3 IS NULL OR t1.class_id = $3)
      AND ($4 IS NULL OR t1.section_id = $4)
      AND ($5 IS NULL OR t2.name ILIKE '%' || $5 || '%')
      AND ($6 IS NULL OR t1.attendance_date >= $6)
      AND ($7 IS NULL OR t1.attendance_date <= $7)
    GROUP BY t2.id
  `;
  const queryParams = [
    schoolId,
    academicYearId,
    classId,
    sectionId,
    name,
    dateFrom,
    dateTo,
  ];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const getStaffDailyAttendanceRecord = async (payload) => {
  const { dateFrom, dateTo, schoolId, roleId, name, academicYearId } = payload;
  const query = `${attendanceRecordQuery}
    WHERE t1.attendance_type = 'D'
      AND t1.school_id = $1
      AND t1.academic_year_id = $2
      AND ($3 IS NULL OR t2.role_id = $3)
      AND ($4 IS NULL OR t2.name ILIKE '%' || $4 || '%')
      AND ($5 IS NULL OR t1.attendance_date >= $5)
      AND ($6 IS NULL OR t1.attendance_date <= $6)
    GROUP BY t2.id
  `;
  const queryParams = [
    schoolId,
    academicYearId,
    roleId,
    name,
    dateFrom,
    dateTo,
  ];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

module.exports = {
  getStudentsForAttendance,
  recordAttendance,
  getStudentSubjectWiseAttendanceRecord,
  getStudentDailyAttendanceRecord,
  getStaffForAttendance,
  getStaffDailyAttendanceRecord,
};
