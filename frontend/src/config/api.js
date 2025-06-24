const isLocal = window.location.hostname === 'localhost';

export const API_BASE_URL = isLocal
  ? 'http://localhost:3000'
  : ''; 

export const SIGNUP_ENDPOINT = `${API_BASE_URL}/api/users/userCreate`;
export const LOGIN_ENDPOINT = `${API_BASE_URL}/api/users/login`;
export const TASKS_ALL_GET = `${API_BASE_URL}/api/tasks/Allget`;
export const CHILD_SIGNUP = `${API_BASE_URL}/api/child/childCreate`;
export const TASKS_INCOMP_GET = `${API_BASE_URL}/api/tasks/getIncomplete`;
export const TASKS_FINISH_GET = `${API_BASE_URL}/api/tasks/finishedHelping`;

