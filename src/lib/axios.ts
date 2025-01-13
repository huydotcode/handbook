import axios from 'axios';

const API_ENDPOINT = process.env.SERVER_API || 'http://localhost:8000/api/v1';

const axiosInstance = axios.create({
    baseURL: API_ENDPOINT,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    },
});

export default axiosInstance;
