import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
})

// Attach JWT to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('civyx_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('civyx_token')
      window.location.href = '/auth'
    }
    return Promise.reject(err)
  }
)

export default api

// ─── Typed API helpers ────────────────────────────────────────────────────────

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
  me: () => api.get('/auth/me'),
}

export const resumeAPI = {
  list: () => api.get('/resumes'),
  get: (id) => api.get(`/resumes/${id}`),
  create: (payload) => api.post('/resumes', payload),
  update: (id, payload) => api.put(`/resumes/${id}`, payload),
  delete: (id) => api.delete(`/resumes/${id}`),
  pdf: (id) => api.get(`/resumes/${id}/pdf`, { responseType: 'blob' }),
}

export const templateAPI = {
  list: () => api.get('/templates'),
}

export const paymentAPI = {
  history: () => api.get('/payments/history'),
  stripeSession: (payload) => api.post('/payments/stripe/create-session', payload),
  paystackInit: (payload) => api.post('/payments/paystack/initialize', payload),
  paystackVerify: (ref) => api.get(`/payments/paystack/verify/${ref}`),
  flutterwaveInit: (payload) => api.post('/payments/flutterwave/initialize', payload),
  flutterwaveVerify: (txId) => api.get(`/payments/flutterwave/verify?transaction_id=${txId}`),
}

export const userAPI = {
  profile: () => api.get('/users/profile'),
  update: (formData) => api.put('/users/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: () => api.delete('/users/profile'),
}
