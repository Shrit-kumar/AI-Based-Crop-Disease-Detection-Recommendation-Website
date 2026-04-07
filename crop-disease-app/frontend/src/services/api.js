import axios from 'axios';
import { auth } from '../firebase';

// Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,   // MUST be http://localhost:5000/api
});

// Attach Firebase ID token
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
    console.log("🔥 Sent Token:", config.headers.Authorization, "URL:", config.url);
  }
  return config;
});

// ---- PLANT IDENTIFY (RIGHT VERSION) ----
export const identifyPlant = async (formData, language = 'en') => {
  return api.post("/identify", formData, {
    headers: { 
      "Content-Type": "multipart/form-data",
      "X-Language": language
    },
  });
};


// ---- OTHER API CALLS ----
export const getDetectionHistory = () => api.get("/detection-history");
export const deleteDetection = (id) => api.delete(`/detection-history/${id}`);
export const getUserProfile = () => api.get("/auth/profile");
export const getWeather = (lat, lon) => api.get(`/weather?lat=${lat}&lon=${lon}`);

export default api;
