const { ERROR_MESSAGES } = require("../../constants");
const { ApiError, sendAccountVerificationEmail } = require("../../utils");
const {
  findStudentDetail,
  addOrUpdateStudent,
  getStudentDueFees,
} = require("./student-repository");

const getStudentDetail = async (paylaod) => {
  const student = await findStudentDetail(paylaod);
  if (!student) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
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
    throw new ApiError(500, error.message);
  }
};

const updateStudent = async (payload) => {
  const result = await addOrUpdateStudent(payload);
  if (!result.status) {
    throw new ApiError(500, result.message);
  }
  return { message: result.message };
};

const processGetStudentDueFees = async (payload) => {
  const dueFees = await getStudentDueFees(payload);
  if (!dueFees || dueFees.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return { dueFees };
};

module.exports = {
  getStudentDetail,
  addNewStudent,
  updateStudent,
  processGetStudentDueFees,
};
