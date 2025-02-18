const processDBRequest = require("../../utils/process-db-request");

const userAttendanceListQuery = `
  SELECT
    t1.id AS "userId",
    t1.name AS "userName",
    COALESCE(t4.code, 'AB') AS "attendanceStatus"
  FROM users t1
  LEFT JOIN user_profiles t2 ON t2.user_id = t1.id
  LEFT JOIN attendances t3
    ON t3.user_id = t1.id
    AND t3.academic_year_id = (SELECT id FROM academic_years WHERE school_id = $1 AND is_active = true)
    AND t3.attendance_date = $2
  LEFT JOIN attendance_status t4 ON t4.id = t3.attendance_status_id
`;

const getStudentsForAttendance = async (payload) => {
  const { classId, sectionId, date, schoolId } = payload;
  const query = `${userAttendanceListQuery}
    JOIN roles t5 ON t5.id = t1.role_id
    WHERE t5.static_role_id = 4
      AND t1.school_id = $1
      AND t2.class_id = $3
      AND ($4 IS NULL OR t2.section_id = $4)
    ORDER BY t1.name
  `;
  const queryParams = [schoolId, date, classId, sectionId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const getStaffForAttendance = async (payload) => {
  const { date, schoolId, roleId } = payload;
  const query = `${userAttendanceListQuery}
    WHERE t1.school_id = $1
      AND ($3 IS NULL OR t1.role_id = $3)
    ORDER BY t1.name
  `;
  const queryParams = [schoolId, date, roleId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const addOrUpdateAttendance = async (payload) => {
  const {
    date,
    schoolId,
    data,
    classId,
    sectionId,
    subjectId,
    attendanceRecorder,
  } = payload;
  const queryParams = [];
  const insertPlaceholders = data
    .map((item, index) => {
      const offset = index * 8;
      queryParams.push(
        schoolId,
        classId || null,
        sectionId || null,
        attendanceRecorder,
        item.userId,
        item.attendanceStatus,
        date,
        subjectId || null
      );
      return `(
        $${offset + 1},
        (SELECT id FROM academic_years WHERE school_id = $${
          offset + 1
        } AND is_active = TRUE),
        $${offset + 2},
        $${offset + 3},
        $${offset + 4},
        $${offset + 5},
        $${offset + 6},
        $${offset + 7},
        $${offset + 8}
    )`;
    })
    .join(",");

  const query = `
  INSERT INTO attendances(
    school_id,
    academic_year_id,
    class_id,
    section_id,
    attendance_recorder,
    user_id,
    attendance_status_id,
    attendance_date,
    subjectId
  )
    VALUES ${insertPlaceholders}
    ON CONFLICT(school_id, class_id, section_id, user_id, attendance_date, subjectId)
    DO UPDATE SET attendance_status_id = EXCLUDED.attendance_status_id;
  `;
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
      JOIN attendance_status t5 ON t5.id = t1.attendance_status_id
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
    JOIN attendance_status t5 ON t5.id = t1.attendance_status_id
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
    t2.id AS "userId",
    t2.name AS "userName",
    t3.roll AS "userRoll",
    COUNT(DISTINCT t1.attendance_date) AS "totalOperatingDays",
    COUNT(CASE WHEN t4.code = 'PR' THEN 1 ELSE NULL END) AS "totalPresentDays"
  FROM attendances t1
  JOIN users t2 ON t2.id = t1.user_id
  JOIN user_profiles t3 ON t3.user_id = t2.id
  LEFT JOIN attendance_status t4 ON t4.id = t1.attendance_status_id
`;

const getStudentDailyAttendanceRecord = async (payload) => {
  const { dateFrom, dateTo, schoolId, classId, sectionId, academicYearId } =
    payload;
  const query = `${attendanceRecordQuery}
    JOIN roles t5 ON t5.id = t2.role_id
    WHERE t1.attendance_type = 'D'
      AND t5.static_role_id = 4
      AND t1.school_id = $1
      AND t1.class_id = $2
      AND ($3 IS NULL OR t1.section_id = $3)
      AND t1.academic_year_id = $4
      AND t1.attendance_date BETWEEN $5 AND $6
    GROUP BY t2.id
  `;
  const queryParams = [
    schoolId,
    classId,
    sectionId,
    academicYearId,
    dateFrom,
    dateTo,
  ];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const getStaffDailyAttendanceRecord = async (payload) => {
  const { dateFrom, dateTo, schoolId, classId, sectionId, academicYearId } =
    payload;
  const query = `${attendanceRecordQuery}
    WHERE t1.attendance_type = 'D'
      AND ($1 IS NULL OR t2.role_id = $1)
      AND t1.academic_year_id = $2
      AND t1.attendance_date BETWEEN $3 AND $4
    GROUP BY t2.id
  `;
  const queryParams = [
    schoolId,
    classId,
    sectionId,
    academicYearId,
    dateFrom,
    dateTo,
  ];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

module.exports = {
  getStudentsForAttendance,
  addOrUpdateAttendance,
  getStudentSubjectWiseAttendanceRecord,
  getStudentDailyAttendanceRecord,
  getStaffForAttendance,
  getStaffDailyAttendanceRecord,
};
