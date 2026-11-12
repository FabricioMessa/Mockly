import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  applyTheme,
  readPreferences,
  savePreferences,
} from '../lib/preferences'
import type { Preferences } from '../lib/preferences'
import { AppSettingsContext } from './appSettings'
import type { AppSettingsContextValue } from './appSettings'

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<Preferences>(() => {
    const initial = readPreferences()
    applyTheme(initial.theme)
    return initial
  })

  useEffect(() => {
    savePreferences(preferences)
    applyTheme(preferences.theme)
    document.documentElement.lang = preferences.language
  }, [preferences])

  const update = useCallback((patch: Partial<Preferences>) => {
    setPreferences((previous) => ({ ...previous, ...patch }))
  }, [])

  const value = useMemo<AppSettingsContextValue>(
    () => ({
      ...preferences,
      setLanguage: (language) => update({ language }),
      toggleLanguage: () =>
        setPreferences((previous) => ({
          ...previous,
          language: previous.language === 'es' ? 'en' : 'es',
        })),
      setNotifications: (notifications) => update({ notifications }),
      setTheme: (theme) => update({ theme }),
      setTimezone: (timezone) => update({ timezone }),
      setPublicProfile: (publicProfile) => update({ publicProfile }),
    }),
    [preferences, update],
  )

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  )
}
