import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const setAuthHeader = () => {
    const token = localStorage.getItem('token');
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
};

export const login = async (username, password) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username,
        password
    });
    
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('username', response.data.username);
        setAuthHeader();
    }
    
    return response.data;
};

export const register = async (username, password, email) => {
    return await axios.post(`${API_BASE_URL}/auth/register`, {
        username,
        password,
        email
    });
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    delete axios.defaults.headers.common['Authorization'];
};

export const getCurrentUser = () => {
    return {
        token: localStorage.getItem('token'),
        userId: localStorage.getItem('userId'),
        username: localStorage.getItem('username')
    };
};

export const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
};

setAuthHeader();