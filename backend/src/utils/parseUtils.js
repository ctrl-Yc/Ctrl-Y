const tasksServices = require("../services/tasks");

const getParentId = async (user) => {
    return user.role === 'parent' ? user.user_id : await tasksServices.getParentId(user.user_id);
};

const parseLabels = (labelParam, queryLabels) => {
    if (labelParam) {
        return [labelParam.toUpperCase()];
    }

    if (queryLabels) {
        return queryLabels.split(",").map(label => label.toUpperCase());
    }

    return undefined;
};

const parseTaskId = (taskIdParam) => {
    return parseInt(taskIdParam, 10);
};

module.exports = {
    getParentId,
    parseLabels,
    parseTaskId,
};