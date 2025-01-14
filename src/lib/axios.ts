import axios from 'axios';

let BASE_URL;

if (process.env.NODE_ENV === 'development') {
    BASE_URL = 'http://localhost:8000/api/v1';
} else {
    BASE_URL = 'https://handbook-api.vercel.app/api/v1';
}

console.log('BASE_URL', BASE_URL);

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    (config) => {
        console.log({
            config,
        });
        // Xử lý trước khi gửi request
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        // Xử lý lỗi khi gửi request
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

export default axiosInstance;
