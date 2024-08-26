const { processDBRequest } = require("../../utils");

const getMenus = async () => {
    const query = `
        SELECT
            id,
            name,
            parent_id,
            hierarchy_id
        FROM access_controls
        WHERE type = 'menu'`;
    const { rows } = await processDBRequest({ query });
    return rows;
}

module.exports = {
    getMenus
};
