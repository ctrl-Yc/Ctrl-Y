const AppError = require('./AppError');

/**
 * タスクの所有者であることを確認する
 * @param {object} task - Prismaから取得したタスクオブジェクト
 * @param {string} parent_id - 認証済み親ユーザーのID
 */
function assertTaskOwner(task, parent_id) {
    if (task.parent_id !== parent_id) {
        throw new AppError("このタスクを操作する権限がありません", 403);
    }
}

module.exports = { assertTaskOwner };
