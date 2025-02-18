const { ERROR_MESSAGES } = require("../../constants");
const { ApiError, sendAccountVerificationEmail } = require("../../utils");
const {
  findAllStudents,
  findStudentDetail,
  findStudentToSetStatus,
  addOrUpdateStudent,
  getStudentDueFees,
} = require("./student-repository");

const getAllStudents = async (payload) => {
  const students = await findAllStudents(payload);
  if (students.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return { students };
};

const getStudentDetail = async (paylaod) => {
  const student = await findStudentDetail(paylaod);
  if (!student) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return student;
};

const addNewStudent = async (payload) => {
  const ADD_STUDENT_SUCCESS = "Student added successfully.";
  const ADD_STUDENT_AND_EMAIL_SEND_SUCCESS =
    "Student added and verification email sent successfully.";
  const ADD_STUDENT_AND_BUT_EMAIL_SEND_FAIL =
    "Student added, but failed to send verification email.";
  try {
    const result = await addOrUpdateStudent(payload);

    if (!result.status) {
      throw new ApiError(500, result.message);
    }

    if (!payload.hasSystemAccess) {
      return { message: ADD_STUDENT_SUCCESS };
    }

    try {
      await sendAccountVerificationEmail({
        userId: result.userId,
        userEmail: payload.email,
      });
      return { message: ADD_STUDENT_AND_EMAIL_SEND_SUCCESS };
    } catch (error) {
      return { message: ADD_STUDENT_AND_BUT_EMAIL_SEND_FAIL };
    }
  } catch (error) {
    throw new ApiError(500, "Unable to add student");
  }
};

const updateStudent = async (payload) => {
  const result = await addOrUpdateStudent(payload);
  if (!result.status) {
    throw new ApiError(500, result.message);
  }
  return { message: result.message };
};

const setStudentStatus = async (paylaod) => {
  const affectedRow = await findStudentToSetStatus(paylaod);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to disable student");
  }
  return { message: "Student status changed successfully" };
};

const processGetStudentDueFees = async (payload) => {
  const dueFees = await getStudentDueFees(payload);
  if (!dueFees || dueFees.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return { dueFees };
};

module.exports = {
  getAllStudents,
  getStudentDetail,
  addNewStudent,
  setStudentStatus,
  updateStudent,
  processGetStudentDueFees,
};
