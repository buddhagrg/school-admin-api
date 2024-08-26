const { fetchMenus } = require("./menus-service");

const handleGetMenus = async (req, res) => {
    const menus = await fetchMenus();
    res.json({ menus });
}

module.exports = {
    handleGetMenus
};
