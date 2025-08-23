import axios from "axios";

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Create axios instance with default configuration
export const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // 30 seconds timeout for image processing
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor for logging
api.interceptors.request.use(
    (config) => {
        console.log(
            `API Request: ${config.method?.toUpperCase()} ${config.url}`
        );
        return config;
    },
    (error) => {
        console.error("API Request Error:", error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        console.log(`API Response: ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error("API Response Error:", error);
        return Promise.reject(error);
    }
);

export default api;
