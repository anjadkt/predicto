import axios from "axios";
import { getRefresh } from "../services/auth.service";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

api.interceptors.response.use(
    response => response,
    async error => {

        const originalRequest = error.config;

        if (originalRequest.url === "/auth/refresh") {
            return Promise.reject(error);
        }

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {

                await getRefresh();

                return api(originalRequest);

            } catch (err) {
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default api;