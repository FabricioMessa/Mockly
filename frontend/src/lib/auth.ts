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

export function login(email: string, password: string): boolean {
  if (
    email === DEMO_CREDENTIALS.email &&
    password === DEMO_CREDENTIALS.password
  ) {
    startSession()
    return true
  }

  const user = getStoredUser()
  if (!user || user.email !== email || user.password !== password) {
    return false
  }

  startSession()
  return true
}

export function logout() {
  window.localStorage.removeItem(TOKEN_KEY)
}

export function isAuthenticated(): boolean {
  return Boolean(window.localStorage.getItem(TOKEN_KEY))
}

export function ensureDemoUser() {
  if (!getStoredUser()) {
    saveUser({
      fullName: 'Andrea Quispe',
      email: DEMO_CREDENTIALS.email,
      password: DEMO_CREDENTIALS.password,
    })
  }
}
