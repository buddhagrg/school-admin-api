import { processDBRequest } from '../../utils/process-db-request.js';

export const bookDemo = async (payload) => {
  const {
    status,
    schoolName,
    contactPerson,
    contactPersonRole,
    email,
    phone,
    schoolSize,
    additionalInfo
  } = payload;
  const query = `
    INSERT INTO demo_requests(
        contact_person,
        email,
        demo_requests_status_code,
        school_name,
        contact_person_role_code,
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
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0].id;
};

export const updateDemoDateTime = async (payload) => {
  const { demoId, dateTime } = payload;
  const query = `
    UPDATE demo_requests
    SET demo_date_time = $2, demo_requests_status_code = 'DEMO_CONFIRMED' 
    WHERE id = $1
    `;
  const queryParams = [demoId, dateTime];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

export const updateDemoDetail = async (payload) => {
  const {
    demoId,
    schoolName,
    contactPerson,
    contactPersonRole,
    email,
    phone,
    schoolSize,
    additionalInfo
  } = payload;
  const query = `
    UPDATE demo_requests
    SET school_name = $2,
        contact_person  =$3,
        contact_person_role_code = $4,
        email = $5,
        phone = $6,
        school_size = $7,
        additional_information = $8,
        demo_requests_status_code = $9,
        demo_date_time = $10
    WHERE id = $1
    `;
  const queryParams = [
    demoId,
    schoolName,
    contactPerson,
    contactPersonRole,
    email,
    phone,
    schoolSize,
    additionalInfo,
    demoRequestsStatus,
    demoDateTime
  ];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

export const updateStatusAndGetDemoDetail = async (demoId, client) => {
  const query = `
    UPDATE demo_requests
    SET demo_requests_status_code = 'DEMO_COMPLETION_FOLLOWUP_EMAIL_SENT'
    WHERE id = $1 AND demo_requests_status_code = 'DEMO_CONFIRMED'
    RETURNING *
  `;
  const queryParams = [demoId];
  const { rows } = await processDBRequest({ query, queryParams, client });
  return rows[0];
};

export const manageDirectAccessRequest = async (payload, client) => {
  const { demoId, status } = payload;
  const query = `
    UPDATE demo_requests
    SET demo_requests_status_code = $1
    WHERE id = $2 AND demo_requests_status_code ='ACCOUNT_SETUP_REQUEST_RECEIVED';
  `;
  const queryParams = [status, demoId];
  const { rowCount } = await processDBRequest({ query, queryParams, client });
  return rowCount;
};

export const confirmInvite = async (demoId, client) => {
  const query = `
    UPDATE demo_requests
    SET demo_requests_status_code = 'PWD_SETUP_INVITE_SENT'
    WHERE id = $1
      AND demo_requests_status_code IN ('DEMO_COMPLETION_FOLLOWUP_EMAIL_SENT', 'ACCOUNT_VERIFICATION_EMAIL_SENT')
  `;
  const queryParams = [demoId];
  const { rowCount } = await processDBRequest({ query, queryParams, client });
  return rowCount;
};

export const getDemoDetail = async (demoId) => {
  const query = `SELECT * FROM demo_requests WHERE id = $1`;
  const queryParams = [demoId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};
