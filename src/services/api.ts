import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5032/api'
});

export default api; 