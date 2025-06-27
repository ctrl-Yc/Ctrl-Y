const TOKEN_KEY = 'token';

export const responseToken = (token) => {
localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const setToken = (token) => {
  localStorage.setItem("token", token);
};