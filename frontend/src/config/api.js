const isLocal = window.location.hostname === 'localhost';

export const API_BASE_URL = isLocal ? 'http://localhost:3000' : '';

export const SIGNUP_PARENT = `${API_BASE_URL}/api/user/create`;
export const SIGNUP_CHILD = `${API_BASE_URL}/child/create`;

export const LOGIN_PARENT = `${API_BASE_URL}/api/user/login`;
export const LOGIN_CHILD = (child_id) => `${API_BASE_URL}/child/login/${child_id}`;

export const TASKS_ALL_GET = `${API_BASE_URL}/api/tasks/Allget`;
export const TASKS_INCOMP_GET = `${API_BASE_URL}/api/tasks/getIncomplete`;
export const TASKS_FINISH_GET = `${API_BASE_URL}/api/tasks/finishedHelping`;

export const TASK_UPDATE_API = `${API_BASE_URL}/api/tasks/taskEdit/`;
export const TASK_DELETE_API = `${API_BASE_URL}/api/tasks/taskDelete/`;
export const TASK_ONE_GET = `${API_BASE_URL}/api/tasks/getOnetask/`;
export const TASK_CREATE_POST = `${API_BASE_URL}/api/tasks/newtaskadd`;
