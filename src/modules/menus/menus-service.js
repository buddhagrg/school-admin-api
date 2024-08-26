const { ApiError, getAccessItemHierarchy } = require("../../utils");
const { getMenus } = require("./menus-repository");


const fetchMenus = async () => {
    const menus = await getMenus();

    if (!Array.isArray(menus) || menus.length <= 0) {
        throw new ApiError(404, "Menus not found");
    }

    return getAccessItemHierarchy(menus);
}

module.exports = {
    fetchMenus
};
