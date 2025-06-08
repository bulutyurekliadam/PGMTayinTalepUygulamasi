import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5032/api'
});

// Başlangıçta token varsa ekle
const token = localStorage.getItem('token');
if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// İstek interceptor'ı
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
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
                delete api.defaults.headers.common['Authorization'];
                window.location.href = '/login';
            }
            // Sunucu hatası
            else if (error.response.status === 500) {
                console.error('Sunucu hatası:', error.response.data);
            }
        } else if (error.request) {
            // Sunucuya ulaşılamadı
            console.error('Sunucuya ulaşılamadı:', error.request);
        } else {
            // İstek oluşturulurken hata
            console.error('İstek hatası:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api; 