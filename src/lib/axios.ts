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

export default axiosInstance;
