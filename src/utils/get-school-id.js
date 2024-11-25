const getSchoolId = async (client, attempts = 0) => {
  const MAX_RETRIES = 5;

  if (attempts >= MAX_RETRIES) {
    throw new ApiError(
      403,
      "Exceeded maximum retries for generating a unique school ID."
    );
  }

  const schoolId = generateSixDigitRandomNumber();
  const exists = await checkIfSchoolExists({ schoolId, client });
  if (!exists) {
    return schoolId;
  }

  return getSchoolId(client, attempts++);
};

module.exports = { getSchoolId };
