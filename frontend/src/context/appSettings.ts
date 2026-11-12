import { createContext, useContext } from 'react'
import type { Language, Preferences, Theme, Timezone } from '../lib/preferences'

export interface AppSettingsContextValue extends Preferences {
  setLanguage: (language: Language) => void
  toggleLanguage: () => void
  setNotifications: (notifications: boolean) => void
  setTheme: (theme: Theme) => void
  setTimezone: (timezone: Timezone) => void
  setPublicProfile: (publicProfile: boolean) => void
}

export const AppSettingsContext =
  createContext<AppSettingsContextValue | null>(null)

export function useAppSettings() {
  const context = useContext(AppSettingsContext)
  if (!context) {
    throw new Error('useAppSettings must be used within AppSettingsProvider')
  }
  return context
}
