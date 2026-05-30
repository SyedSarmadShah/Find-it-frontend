import api from '../lib/api'
import type { AuthResponse, User } from '../types/auth'

export type LoginPayload = {
  email: string
  password: string
}

export type SignupPayload = {
  email: string
  full_name: string
  password: string
  password_confirm: string
}

export async function login(payload: LoginPayload) {
  const { data } = await api.post<AuthResponse>('/auth/login/', payload)
  return data
}

export async function signup(payload: SignupPayload) {
  const { data } = await api.post<AuthResponse>('/auth/signup/', payload)
  return data
}

export async function fetchMe() {
  const { data } = await api.get<User>('/auth/me/')
  return data
}

export async function logout(refresh: string) {
  await api.post('/auth/logout/', { refresh })
}

export async function refreshAccessToken(refresh: string) {
  const { data } = await api.post<{ access: string }>('/auth/token/refresh/', { refresh })
  return data.access
}
