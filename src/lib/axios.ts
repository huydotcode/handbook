import axios from 'axios';

const BASE_URL = process.env.SERVER_API || 'http://localhost:8000/api/v1';

console.log('BASE_URL', BASE_URL);

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
