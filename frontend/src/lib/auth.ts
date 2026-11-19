import { supabase } from './supabase'

export interface StoredUser {
  fullName: string
  email: string
  password: string
}

const USER_KEY = 'mockly_user'
const TOKEN_KEY = 'mockly_token'

export const DEMO_CREDENTIALS = {
  email: 'demo@mockly.com',
  password: 'demo1234',
} as const

export function getStoredUser(): StoredUser | null {
  try {
    const raw = window.localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as StoredUser) : null
  } catch {
    return null
  }
}

export function saveUser(user: StoredUser) {
  window.localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function startSession() {
  window.localStorage.setItem(TOKEN_KEY, 'session_active_123')
}

export async function logout() {
  window.localStorage.removeItem(TOKEN_KEY)
  window.localStorage.removeItem(USER_KEY)
  await supabase.auth.signOut()
}

export function isAuthenticated(): boolean {
  return Boolean(window.localStorage.getItem(TOKEN_KEY))
}

export function ensureDemoUser() {
  // Desactivado para no sobreescribir el usuario real de Supabase
}