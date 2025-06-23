const isLocal = window.location.hostname === 'localhost';

export const API_BASE_URL = isLocal
  ? 'http://localhost:3000'
  : ''; 

export const SIGNUP_ENDPOINT = `${API_BASE_URL}/api/users/userCreate`;
export const TASKS_ALL_GET = `${API_BASE_URL}/api/tasks/Allget`;