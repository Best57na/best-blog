import axios from 'axios'
import { API_BASE } from '../utils/api'

export function clearSession() {
  localStorage.removeItem('token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('expires_at')
  localStorage.removeItem('currentUser')
}

export function getTokenExpiryMs() {
  const token = localStorage.getItem('token')
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp ? payload.exp * 1000 : null
  } catch {
    return null
  }
}

export async function extendSession() {
  const refreshToken = localStorage.getItem('refresh_token')
  if (!refreshToken) return { ok: false }
  try {
    const { data } = await axios.post(`${API_BASE}/auth/refresh`, { refresh_token: refreshToken })
    localStorage.setItem('token', data.access_token)
    localStorage.setItem('refresh_token', data.refresh_token)
    localStorage.setItem('expires_at', String(data.expires_at))
    return { ok: true }
  } catch {
    return { ok: false }
  }
}
