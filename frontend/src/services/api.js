import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

// Agrega el token JWT en cada request automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Si el token expira, redirige al login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ---- Auth ----
export const register = (username, password) =>
  api.post('/auth/register', { username, password })

export const login = (username, password) => {
  const form = new FormData()
  form.append('username', username)
  form.append('password', password)
  return api.post('/auth/login', form)
}

// ---- Cards ----
export const getCards = (search = '') =>
  api.get('/cards/', { params: search ? { search } : {} })

export const getCard = (id) => api.get(`/cards/${id}`)

export const createCard = (data) => api.post('/cards/', data)

export const updateCard = (id, data) => api.put(`/cards/${id}`, data)

export const deleteCard = (id) => api.delete(`/cards/${id}`)

// ---- Observations ----
export const addObservation = (cardId, data) =>
  api.post(`/cards/${cardId}/observations`, data)

export const deleteObservation = (cardId, obsId) =>
  api.delete(`/cards/${cardId}/observations/${obsId}`)

export default api
