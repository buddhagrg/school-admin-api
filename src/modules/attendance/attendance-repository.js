const processDBRequest = require("../../utils/process-db-request");
const { parseISO } = require("date-fns");

const userAttendanceListQuery = `
  SELECT
    t1.id AS "userId",
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
    AND t3.attendance_date = $2::date
  LEFT JOIN attendance_status t4 ON t4.code = t3.attendance_status_code
`;

const getStudentsForAttendance = async (payload) => {
  const { classId, sectionId, name, schoolId, attendanceDate } = payload;
  const _sectionId = sectionId ? Number(sectionId) : null;
  const _name = typeof name === "string" ? name : null;
  const _attendanceDate = attendanceDate ? parseISO(attendanceDate) : null;
  const query = `${userAttendanceListQuery}
    WHERE r.static_role_id = 4
      AND t1.school_id = $1
      AND t2.class_id = $3
      AND ($4::int IS NULL OR t2.section_id = $4::int)
      AND ($5::text IS NULL OR t1.name ILIKE '%' || $5::text || '%')
    ORDER BY t1.name
  `;
  const queryParams = [schoolId, _attendanceDate, classId, _sectionId, _name];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const getStaffForAttendance = async (payload) => {
  const { schoolId, roleId, name, attendanceDate } = payload;
  const _roleId = roleId ? Number(roleId) : null;
  const _name = typeof name === "string" ? name : null;
  const _attendanceDate = attendanceDate ? parseISO(attendanceDate) : null;
  const query = `${userAttendanceListQuery}
    WHERE r.static_role_id != 4
      AND t1.school_id = $1
      AND ($3::int IS NULL OR t1.role_id = $3::int)
      AND ($4::text IS NULL OR t1.name ILIKE '%' || $4::text || '%')
    ORDER BY t1.name
  `;
  const queryParams = [schoolId, _attendanceDate, _roleId, _name];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const recordAttendance = async (payload) => {
  const now = new Date();
  const { schoolId, attendances, attendanceRecorder, attendanceDate } = payload;
  console.log(payload);
  const _attendanceDate = attendanceDate ? parseISO(attendanceDate) : null;

  const query = `
  INSERT INTO attendances(
    school_id,
    academic_year_id,
    user_id,
    attendance_status_code,
    remarks,
    attendance_date,
    updated_date,
    attendance_recorder
  )
    SELECT
      $1,
      (SELECT id FROM academic_years WHERE school_id = $1 AND is_active = true LIMIT 1),
      (t->> 'userId')::int,
      (t->> 'status')::char(2),
      (t->> 'remarks')::text,
      $2,
      $3,
      $4
    FROM jsonb_array_elements($5::jsonb) AS t  
    ON CONFLICT(school_id, academic_year_id, user_id, attendance_date)
    DO UPDATE SET
      attendance_status_code = EXCLUDED.attendance_status_code,
      remarks = EXCLUDED.remarks,
      updated_date = EXCLUDED.updated_date;
  `;
  const queryParams = [
    schoolId,
    _attendanceDate,
    now,
    attendanceRecorder,
    JSON.stringify(attendances),
  ];
  console.log(queryParams);
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
    t1.id,
    t1.user_id as "userId",
    t2.name,
    t1.attendance_date AS "attendanceDate",
    t1.attendance_status_code AS "attendanceStatusCode",
    t3.description AS "attendanceStatus",
    t1.remarks,
    t1.updated_date AS "lastUpdatedDate",
    COUNT(DISTINCT t1.attendance_date) AS "totalOperatingDays",
    COUNT(CASE WHEN t3.code = 'PR' THEN 1 ELSE NULL END) AS "totalPresentDays"
  FROM attendances t1
  JOIN users t2 ON t2.id = t1.user_id
  LEFT JOIN attendance_status t3 ON t3.code = t1.attendance_status_code
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
  const _academicYearId = academicYearId ? Number(academicYearId) : null;
  const _classId = classId ? Number(classId) : null;
  const _sectionId = sectionId ? Number(sectionId) : null;
  const _name = typeof name === "string" ? name : null;
  const _dateFrom = dateFrom ? parseISO(dateFrom) : null;
  const _dateTo = dateTo ? parseISO(dateTo) : null;
  const query = `${attendanceRecordQuery}
    JOIN user_profiles t4 ON t4.user_id = t1.user_id
    JOIN roles t5 ON t5.id = t2.role_id
    JOIN classes t6 ON t6.id = t4.class_id
    LEFT JOIN sections t7 ON t7.id = t4.section_id
    WHERE t1.attendance_type = 'D'
      AND t5.static_role_id = 4
      AND t1.school_id = $1
      AND t1.academic_year_id = $2
      AND ($3::int IS NULL OR t4.class_id = $3::int)
      AND ($4::int IS NULL OR t4.section_id = $4::int)
      AND ($5::text IS NULL OR t2.name ILIKE '%' || $5::text || '%')
      AND (
        $7::date IS NULL AND t1.attendance_date = $6::date
        OR ($7::date IS NOT NULL AND t1.attendance_date BETWEEN $6::date AND $7::date) 
      )
    GROUP BY t1.id, t1.user_id, t2.name, t1.attendance_status_code, t3.description, t1.attendance_date
  `;
  const queryParams = [
    schoolId,
    _academicYearId,
    _classId,
    _sectionId,
    _name,
    _dateFrom,
    _dateTo,
  ];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const getStaffDailyAttendanceRecord = async (payload) => {
  const { dateFrom, dateTo, schoolId, roleId, name, academicYearId } = payload;
  const _academicYearId = academicYearId ? Number(academicYearId) : null;
  const _name = typeof name === "string" ? name : null;
  const _dateFrom = dateFrom ? parseISO(dateFrom) : null;
  const _dateTo = dateTo ? parseISO(dateTo) : null;
  const _roleId = roleId ? Number(roleId) : null;
  const query = `${attendanceRecordQuery}
    JOIN roles t4 ON t4.id = t2.role_id
    WHERE t1.attendance_type = 'D'
      AND t1.school_id = $1
      AND t4.static_role_id NOT IN (4, 5)
      AND t1.academic_year_id = $2
      AND ($3::int IS NULL OR t2.role_id = $3::int)
      AND ($4::text IS NULL OR t2.name ILIKE '%' || $4::text || '%')
      AND (
        $6::date IS NULL AND t1.attendance_date = $5::date
        OR ($6::date IS NOT NULL AND t1.attendance_date BETWEEN $5::date AND $6::date) 
      )
    GROUP BY t1.id, t1.user_id, t2.name, t1.attendance_status_code, t3.description, t1.attendance_date
  `;
  const queryParams = [
    schoolId,
    _academicYearId,
    _roleId,
    _name,
    _dateFrom,
    _dateTo,
  ];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const updateAttendanceStatus = async (payload) => {
  const { schoolId, attendanceId, status, remarks } = payload;
  const now = new Date();
  const query = `
    UPDATE attendances
    SET
      attendance_status_code = $1,
      remarks = $2,
      updated_date = $3
    WHERE school_id = $4 AND id = $5
  `;
  const queryParams = [status, remarks, now, schoolId, attendanceId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

module.exports = {
  getStudentsForAttendance,
  recordAttendance,
  getStudentSubjectWiseAttendanceRecord,
  getStudentDailyAttendanceRecord,
  getStaffForAttendance,
  getStaffDailyAttendanceRecord,
  updateAttendanceStatus,
};
