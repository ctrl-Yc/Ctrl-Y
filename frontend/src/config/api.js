const isLocal = window.location.hostname === "localhost";

export const API_BASE_URL = isLocal ? "http://localhost:3000" : "";

//親ユーザー
export const PARENT_BASE = `${API_BASE_URL}/api/parents`;
export const PARENT_SIGNUP = PARENT_BASE;
export const PARENT_LOGIN = `${PARENT_BASE}/login`;

//子供ユーザー
export const CHILDREN_BASE = `${API_BASE_URL}/api/parents`;
export const CHILDREN_SIGNUP = PARENT_BASE;
export const CHILDREN_LOGIN = ( child_id ) => `${PARENT_BASE}/${child_id}/login`;

//タスク系
export const TASKS_BASE = `${API_BASE_URL}/api/tasks`;

//一覧取得
export const TASKS_COLLECTION = TASKS_BASE;