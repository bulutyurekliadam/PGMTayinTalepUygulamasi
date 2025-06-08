import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5032/api'
});

// Token yönetimi için yardımcı fonksiyon
const getAuthToken = () => {
    return localStorage.getItem('token');
};

// İstek interceptor'ı
api.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Yanıt interceptor'ı
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Token geçersiz veya süresi dolmuşsa
            if (error.response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
            // Yetkilendirme hatası
            else if (error.response.status === 403) {
                console.error('Yetkilendirme hatası:', error.response.data);
            }
            // Sunucu hatası
            else if (error.response.status === 500) {
                console.error('Sunucu hatası:', error.response.data);
            }
        } else if (error.request) {
            console.error('Sunucuya ulaşılamadı:', error.request);
        } else {
            console.error('İstek hatası:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api; 