const get = require('./getService');
const post = require('./postService');
const patch = require('./patchService');
const del = require('./delService');
const stats = require('./statsService');

module.exports = {
    ...get,
    ...post,
    ...patch,
    ...del,
    ...stats,
};