import axios from 'axios';

let BASE_URL;

if (process.env.NODE_ENV === 'development') {
    BASE_URL = 'http://localhost:8000/api/v1';
} else {
    BASE_URL = process.env.NEXT_PUBLIC_SERVER_API;
}

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const accessToken =
                (localStorage && localStorage?.getItem('accessToken')) || null;
            if (accessToken) {
                config.headers['Authorization'] = `Bearer ${accessToken}`;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
