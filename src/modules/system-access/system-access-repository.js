import { processDBRequest } from '../../utils/process-db-request.js';
import { SYSTEM_ACCESS_MESSAGES } from './util/system-access-messages.js';

export const requestSystemAccess = async (payload, client) => {
  const status = SYSTEM_ACCESS_MESSAGES.ACCESS_REQUEST_RECEIVED;
  const { schoolName, contactPerson, contactPersonRole, email, phone, schoolSize, additionalInfo } =
    payload;
  const query = `
    INSERT INTO system_access_requests(
      contact_person,
      email,
      system_access_status_code,
      school_name,
      system_access_person_code,
      phone,
      school_size,
      additional_information
    )
    VALUES($1, $2, $3, $4, $5, $6, $7, $8 )
    RETURNING id
  `;
  const queryParams = [
    contactPerson,
    email,
    status,
    schoolName,
    contactPersonRole,
    phone,
    schoolSize,
    additionalInfo
  ];

  const { rows } = await processDBRequest({ query, queryParams, client });
  return rows[0].id;
};

export const updateRequestStatus = async (payload, client) => {
  const { systemAccessRequestId, status } = payload;
  const query = `
    UPDATE system_access_requests
    SET system_access_status_code = $1
    WHERE id = $2
  `;
  const queryParams = [status, systemAccessRequestId];
  const { rowCount } = await processDBRequest({ query, queryParams, client });
  return rowCount;
};

export const getRequestDetail = async (systemAccessRequestId, client) => {
  const query = `SELECT * FROM system_access_requests WHERE id = $1`;
  const queryParams = [systemAccessRequestId];
  const { rows } = await processDBRequest({ query, queryParams, client });
  return rows[0];
};
