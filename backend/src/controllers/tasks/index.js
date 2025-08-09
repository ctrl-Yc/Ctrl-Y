const get = require('./getController');
const post = require('./postController');
const patch = require('./patchController');
const del = require('./delController');
const stats = require('./statsController');

module.exports = {
    ...get,
    ...post,
    ...patch,
    ...del,
    ...stats,
};