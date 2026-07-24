import axios from 'axios';

// Our Java backend URL
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

// Add token to every request automatically
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// AUTH
export const register = (name, email, password) =>
    axios.post(`${API_URL}/auth/register`, { name, email, password });

export const login = (email, password) =>
    axios.post(`${API_URL}/auth/login`, { email, password });

export const getDoaInbox = () =>
    axios.get(`${API_URL}/doa/inbox`);

export const markAsRecited = (id) =>
    axios.put(`${API_URL}/doa/${id}/recite`);

export const getDoaStats = () =>
    axios.get(`${API_URL}/doa/stats`);

// ONBOARDING
export const markOnboardingSeen = () =>
    axios.patch(`${API_URL}/auth/onboarding`);

// JOURNEY
export const saveJourney = (departureDate, returnDate, departureCity) =>
    axios.post(`${API_URL}/journey`, {
        departureDate: departureDate,
        returnDate: returnDate,
        departureCity: departureCity
    });
export const getJourney = () =>
    axios.get(`${API_URL}/journey`);

// ✅ ONLY ONE sendDoa function (with category)
export const sendDoa = (uniqueLink, senderName, senderEmail, message, category) =>
    axios.post(`${API_URL}/doa/${uniqueLink}`, {
        senderName,
        senderEmail,
        message,
        category
    });

// ✅ NEW: Get AI doa suggestions
export const getDoaSuggestions = async (category) => {
    const response = await axios.post(`${API_URL}/doa/suggest`, { category });
    return response.data.doas;
};