const processDBRequest = require("../../utils/process-db-request");

const getAllFees = async (schoolId) => {
  const query = `SELECT * FROM fees WHERE school_id = $1`;
  const queryParams = [schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const addFee = async (payload) => {
  const { schoolId, name, groupId } = payload;
  const query = `
    INSERT INTO fees(school_id, name, group_id)
    VALUES($1, $2, $3)
  `;
  const queryParams = [schoolId, name, groupId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const updateFee = async (payload) => {
  const { schoolId, name, groupId, feeId } = payload;
  const query = `
    UPDATE fees
    SET name = $1, group_id = $2
    WHERE school_id = $3 AND id = $4
  `;
  const queryParams = [name, groupId, schoolId, feeId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const addOrUpdateFeeStructures = async (payload) => {
  const { schoolId, classId, feeDetails } = payload;
  const queryParams = [];
  const insertValues = feeDetails
    .map((item, index) => {
      const offset = 6 * index;
      queryParams.push(
        schoolId,
        item.feeId,
        item.feeAmount,
        classId,
        item.isActive
      );
      return `(
      $${offset + 1},
      $${offset + 1},
      $${offset + 1},
      $${offset + 1}
    )`;
    })
    .join(",");

  const query = `
    INSERT INTO fee_structures(
      school_id,
      fee_id,
      amount,
      class_id,
      is_active
    )
    VALUES ${insertValues}
    ON CONFLICT(school_id, fee_id, class_id)
    DO UPDATE SET
      amount = EXCLUDED.amount,
      is_active = EXCLUDED.is_active::boolean;
  `;
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const getAllFeeStructures = async (payload) => {
  const { schoolId, classId, sectionId } = payload;
  const query = `
    SELECT
      t1.*,
      t2.name AS "className",
      t3.name AS "sectioName"
    FROM fee_structures t1
    JOIN classes t2 ON t2.id = t1.class_id
    WHERE t1.school_id = $1 AND t1.class_id = $2
  `;
  const queryParams = [schoolId, classId, sectionId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const getFeesAssignedToStudent = async (payload) => {
  const { schoolId, studentId } = payload;
  const query = `
    SELECT
      t2.id AS "studentFeeId",
      t7.name AS "academicPeriod",
      t1.name AS "feeName",
      t2.amount,
      t3.id AS "userId",
      t3.name AS "userName",
      t4.roll,
      t5.name AS "className",
      t6.name AS "sectionName",
      CASE WHEN t2.discount_type = 'P' THEN
        (COALESCE(t2.discount_value,0)/100) * (t2.amount)
      ELSE
        COALESCE(t2.discount_value,0)
      END AS "discountAmount",
      t2.outstanding_amt AS "outstandingAmount"
    FROM student_fees t1
    JOIN fee_structures t2 ON t2.id = t1.fee_id
    JOIN users t3 ON t3.id = t1.student_id
    JOIN user_profiles t4 ON t4.user_id = t1.student_id
    JOIN classes t5 ON t5.id = t4.class_id
    LEFT JOIN sections t6 ON t6.id = t4.section_id
    JOIN academic_periods t7 ON t7.id = t1.academic_period_id
    WHERE t1.school_id = $1 AND t1.student_id = $2
  `;
  const queryParams = [schoolId, studentId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const assignFeeToStudent = async (payload) => {
  const query = `SELECT * FROM assign_student_fees($1)`;
  const queryParams = [payload];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};

const deleteFeeAssignedToStudent = async (payload) => {
  const { schoolId, feeDetails } = payload;
  const feeIds = feeDetails.map(({ feeId }) => feeId);
  const studentIds = feeDetails.map(({ studentId }) => studentId);
  const query = `
    DELETE
    FROM student_fees
    WHERE school_id = $1
      AND (student_id, fee_structure_id) IN (
        SELECT student_id, fee_structure_id
        FROM UNNEST($2::int[], $3::int[]) AS t(student_id, fee_structure_id)
      )
  `;
  const queryParams = [schoolId, studentIds, feeIds];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

module.exports = {
  getAllFees,
  addFee,
  updateFee,
  addOrUpdateFeeStructures,
  getAllFeeStructures,
  getFeesAssignedToStudent,
  assignFeeToStudent,
  deleteFeeAssignedToStudent,
};
