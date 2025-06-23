const isLocal = window.location.hostname === 'localhost';

export const API_BASE_URL = isLocal
  ? 'http://localhost:3000'
  : ''; 

export const SIGNUP_ENDPOINT = `${API_BASE_URL}/api/users/userCreate`;
export const TASKS_INCOMP_GET = `${API_BASE_URL}/api/tasks/getIncomplete`;
export const TASKS_FINISH_GET = `${API_BASE_URL}/api/tasks/finishedHelping`;
export const TASK_UPDATE_API = `${API_BASE_URL}/api/tasks/taskEdit/`;
export const TASK_DELETE_API = `${API_BASE_URL}/api/tasks/taskDelete/`;
export const TASK_ONE_GET = `${API_BASE_URL}/api/tasks/getTask/`;