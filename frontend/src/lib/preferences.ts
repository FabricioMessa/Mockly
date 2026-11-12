export type Language = 'es' | 'en'
export type Theme = 'light' | 'dark'
export type Timezone =
  | 'America/Argentina/Buenos_Aires'
  | 'America/Lima'
  | 'America/Santiago'
  | 'America/La_Paz'

export interface Preferences {
  language: Language
  notifications: boolean
  theme: Theme
  timezone: Timezone
  publicProfile: boolean
}

export const DEFAULT_PREFERENCES: Preferences = {
  language: 'es',
  notifications: true,
  theme: 'light',
  timezone: 'America/Lima',
  publicProfile: false,
}

const STORAGE_KEY = 'mockly_preferences'

export interface TimezoneOption {
  value: Timezone
  countryEs: string
  countryEn: string
  offset: string
}

export const TIMEZONE_OPTIONS: TimezoneOption[] = [
  {
    value: 'America/Argentina/Buenos_Aires',
    countryEs: 'Argentina',
    countryEn: 'Argentina',
    offset: 'GMT-03:00',
  },
  {
    value: 'America/Lima',
    countryEs: 'Perú',
    countryEn: 'Peru',
    offset: 'GMT-05:00',
  },
  {
    value: 'America/Santiago',
    countryEs: 'Chile',
    countryEn: 'Chile',
    offset: 'GMT-04:00',
  },
  {
    value: 'America/La_Paz',
    countryEs: 'Bolivia',
    countryEn: 'Bolivia',
    offset: 'GMT-04:00',
  },
]

const VALID_TIMEZONES = TIMEZONE_OPTIONS.map((option) => option.value)

export function readPreferences(): Preferences {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_PREFERENCES

    const parsed = JSON.parse(raw) as Partial<Preferences>
    return {
      language: parsed.language === 'en' ? 'en' : 'es',
      notifications:
        typeof parsed.notifications === 'boolean'
          ? parsed.notifications
          : DEFAULT_PREFERENCES.notifications,
      theme: parsed.theme === 'dark' ? 'dark' : 'light',
      timezone: VALID_TIMEZONES.includes(parsed.timezone as Timezone)
        ? (parsed.timezone as Timezone)
        : DEFAULT_PREFERENCES.timezone,
      publicProfile:
        typeof parsed.publicProfile === 'boolean'
          ? parsed.publicProfile
          : DEFAULT_PREFERENCES.publicProfile,
    }
  } catch {
    return DEFAULT_PREFERENCES
  }
}

export function savePreferences(preferences: Preferences) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme
}

export function timezoneLabel(
  timezone: Timezone,
  language: Language,
): string {
  const option = TIMEZONE_OPTIONS.find((item) => item.value === timezone)
  if (!option) return timezone
  const country = language === 'es' ? option.countryEs : option.countryEn
  return `${country} (${option.offset})`
}
