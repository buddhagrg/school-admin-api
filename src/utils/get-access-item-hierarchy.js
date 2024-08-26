const getAccessItemHierarchy = (items) => {
    if (!items || items.length <= 0) return [];

    const parents = items.filter(item => !item.parent_id);
    const children = items.filter(item => item.parent_id);

    const sortedParents = parents.sort((a, b) => a.hierarchy_id - b.hierarchy_id);
    const sortedChildren = children.sort((a, b) => a.hierarchy_id - b.hierarchy_id);

    const result = sortedParents.map(parent => {
        const { parent_id, hierarchy_id, ...rest } = parent;
        return {
            ...rest,
            subMenus: sortedChildren
                .filter(child => child.parent_id === parent.id)
                .map(({ parent_id, hierarchy_id, icon, ...restChild }) => restChild)
        }
    });

    return result;
}

module.exports = {
    getAccessItemHierarchy
};