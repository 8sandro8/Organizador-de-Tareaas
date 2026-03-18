import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
});

api.interceptors.request.use((config) => {
    const currentUser = localStorage.getItem('dam_currentUser') || 'SANDRO';
    config.headers['X-User-Environment'] = currentUser;
    return config;
});

export const switchUser = async (user) => {
    const response = await api.post('/switch-user', { user });
    return response.data;
};

export const getCurrentUser = async () => {
    const response = await api.get('/current-user');
    return response.data;
};

export default api;
