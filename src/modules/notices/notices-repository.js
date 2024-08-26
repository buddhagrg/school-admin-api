const { db } = require("../../config");
const { processDBRequest } = require("../../utils");

const getNotices = async (userId) => {
    const query = `SELECT * FROM get_notices($1)`;
    const queryParams = [userId];
    const { rows } = await processDBRequest({ query, queryParams });
    return rows;
}

const getNoticeById = async (id) => {
    const query = `
        SELECT
            t1.id,
            t1.title,
            t1.description,
            t1.status,
            t1.author_id AS "authorId",
            t1.created_dt AS "createdDate",
            t1.updated_dt AS "updatedDate",
            t1.recipient_type AS "recipientType",
            t1.recipient_role_id AS "recipientRole",
            t1.recipient_first_field AS "firstField",
            t2.name AS author
        FROM notices t1
        LEFT JOIN users t2 ON t1.author_id = t2.id
        WHERE t1.id = $1
    `;
    const queryParams = [id];
    const { rows } = await processDBRequest({ query, queryParams });
    return rows[0];
}

const addNewNotice = async (payload) => {
    const now = new Date();
    const {
        title,
        status,
        description,
        recipientType,
        recipientRole,
        firstField: recipientFirstField,
        authorId
    } = payload;
    const query = `
        INSERT INTO notices
        (title, description, status, recipient_type, recipient_role_id, recipient_first_field, created_dt, author_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
    const queryParams = [title, description, status, recipientType, recipientRole, recipientFirstField, now, authorId];
    const { rowCount } = await processDBRequest({ query, queryParams });
    return rowCount;
}

const updateNoticeById = async (payload) => {
    const now = new Date();
    const {
        id,
        title,
        status,
        description,
        recipientType,
        recipientRole,
        firstField
    } = payload;
    const query = `
        UPDATE notices
        SET
            title = $1,
            description = $2,
            status = $3,
            recipient_type = $4,
            recipient_role_id = $5,
            recipient_first_field = $6,
            updated_dt = $7
        WHERE id = $8
    `;
    const queryParams = [title, description, status, recipientType, recipientRole, firstField, now, id];
    const { rowCount } = await processDBRequest({ query, queryParams });
    return rowCount;
}

const getNoticeRecipients = async () => {
    try {
        const noticeRecipientTypesQuery = "SELECT * FROM notice_recipient_types";
        const { rows: noticeRecipientTypes } = await db.query(noticeRecipientTypesQuery);

        if (noticeRecipientTypes.length <= 0) {
            return [];
        }

        const recipientPromises = noticeRecipientTypes.map(async (recipientType) => {
            const {
                role_id,
                primary_dependent_name,
                primary_dependent_select
            } = recipientType;

            const selectRoleQuery = `SELECT name FROM roles WHERE id = $1`;
            const { rows } = await db.query(selectRoleQuery, [role_id]);
            const recipient = { id: role_id, name: rows[0].name };

            const { rows: dependentRows } = primary_dependent_select
                ? await db.query(primary_dependent_select)
                : await Promise.resolve({ rows: [] });

            recipient.primaryDependents = { name: primary_dependent_name, list: dependentRows };

            return recipient;
        });

        const result = await Promise.all(recipientPromises);
        return result;
    } catch (error) {
        throw error;
    }
}

const manageNoticeStatus = async (payload) => {
    const { status, reviewerId, noticeId, reviewDate } = payload;
    const query = `
        UPDATE notices
        SET
            status = $1,
            reviewed_dt = $2,
            reviewer_id = $3
        WHERE id = $4
    `;
    const queryParams = [status, reviewDate, reviewerId, noticeId];
    const { affectedRow } = await processDBRequest({ query, queryParams });
    return affectedRow;
}

module.exports = {
    getNoticeById,
    addNewNotice,
    updateNoticeById,
    getNoticeRecipients,
    manageNoticeStatus,
    getNotices
};