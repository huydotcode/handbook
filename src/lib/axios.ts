import axios from 'axios';

let BASE_URL;

if (process.env.NODE_ENV === 'development') {
    BASE_URL = 'http://localhost:8000/api/v1';
} else {
    BASE_URL = 'https://handbook-api.vercel.app/api/v1';
}

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    (config) => {
        // set cookie from cookie storage to header
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
