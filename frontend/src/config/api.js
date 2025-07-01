const isLocal = window.location.hostname === 'localhost';

export const API_BASE_URL = isLocal ? 'http://localhost:3000' : '';

export const SIGNUP_PARENT = `${API_BASE_URL}/api/user/create`;
export const SIGNUP_CHILD = `${API_BASE_URL}/child/create`;

export const LOGIN_PARENT = `${API_BASE_URL}/api/user/login`;
export const LOGIN_CHILD = (child_id) => `${API_BASE_URL}/child/login/${child_id}`;

// { /all/:s_id } s_idで未着手・実行中などを管理
export const TASKS_ALL_GET = `${API_BASE_URL}/api/tasks/all`;

//↓二つ要らなくなった
export const TASKS_INCOMP_GET = `${API_BASE_URL}/api/tasks/getIncomplete`;
export const TASKS_FINISH_GET = `${API_BASE_URL}/api/tasks/finishedHelping`;

//{ /edit/:task_id }
export const TASK_UPDATE_API = `${API_BASE_URL}/api/tasks/edit/`;
//{ /delete/:task_id }
export const TASK_DELETE_API = `${API_BASE_URL}/api/tasks/delete/`;
//{ /oen/:task_id }
export const TASK_ONE_GET = `${API_BASE_URL}/api/tasks/one/`;
//{ /create }
export const TASK_CREATE_POST = `${API_BASE_URL}/api/tasks/create`;
