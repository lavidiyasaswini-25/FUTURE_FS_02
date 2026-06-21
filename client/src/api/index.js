import axios from 'axios';

const API = axios.create({ baseURL: 'https://future-fs-02-au3l.onrender.com/api' });

// Attach JWT token to every request
API.interceptors.request.use((req) => 
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Auth
export const login    = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);

// Leads
export const fetchLeads    = (params) => API.get('/leads', { params });
export const createLead    = (data)   => API.post('/leads', data);
export const updateStatus  = (id, status) => API.patch(`/leads/${id}/status`, { status });
export const addNote       = (id, text)   => API.post(`/leads/${id}/notes`, { text });
export const deleteLead    = (id)         => API.delete(`/leads/${id}`);
