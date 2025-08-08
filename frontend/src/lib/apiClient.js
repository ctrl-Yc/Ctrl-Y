import axios from "axios";

export const apiClient = axios.create({
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    const childToken = localStorage.getItem("childtoken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    if (childToken) {
        config.headers.ChildAuthorization = `Bearer ${childToken}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});


