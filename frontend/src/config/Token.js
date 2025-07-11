const PARENT_TOKEN_KEY = 'token';
const CHILD_TOKEN_KEY = 'childtoken';

export const setToken = (token) => {
  localStorage.setItem(PARENT_TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(PARENT_TOKEN_KEY);
};

export const responseToken = (token) => {
  setToken(token);
};

export const setChildToken = (childtoken) => {
  localStorage.setItem(CHILD_TOKEN_KEY, childtoken);
};

export const getChildToken = () => {
  return localStorage.getItem(CHILD_TOKEN_KEY);
};

export const clearTokens = () => {
  localStorage.removeItem(PARENT_TOKEN_KEY);
  localStorage.removeItem(CHILD_TOKEN_KEY);
};
