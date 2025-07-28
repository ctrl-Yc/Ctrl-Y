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
		const loginEndpoints = ['/api/parents/login', '/api/children/login'];

		const isLoginEndpoint = loginEndpoints.some(
			(endpoint) => config.url && config.url.includes(endpoint)
		);

		if (!isLoginEndpoint) {
			const token = localStorage.getItem('token') ?? localStorage.getItem('childtoken');
			if (token) {
				if (config.headers) {
					config.headers.Authorization = `Bearer ${token}`;
				}
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
			localStorage.removeItem('childtoken');

			const path = window.location.pathname;

			if (path.startsWith('/child')) {
				const match = path.match(/[0-9a-fA-F-]{36}$/);
				const uuid = match ? match[0] : '';
				window.location.href = `/child/login/${uuid}`;
				return Promise.reject(error);
			}

			window.location.href = '/';
		}
		return Promise.reject(error);
	}
);
