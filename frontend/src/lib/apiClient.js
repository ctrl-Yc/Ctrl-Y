import axios from "axios";

export const apiClient = axios.create({
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    const childToken = localStorage.getItem("childtoken");
    
    // 子供のトークンがある場合は子供のトークンを使用
    if (childToken) {
        config.headers.Authorization = `Bearer ${childToken}`;
    } else if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
}, (error) => {
    return Promise.reject(error);
});


