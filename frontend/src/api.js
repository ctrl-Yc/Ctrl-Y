import axios from 'axios';
import { API_BASE_URL } from './config/api';

export const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
});

api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token');
		if (token) {
			if (config.headers) {
				config.headers.Authorization = `Bearer ${token}`;
			}
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response.status === 401) {
			localStorage.removeItem('token');
			window.location.href = '/';
		}
		return Promise.reject(error);
	}
);
