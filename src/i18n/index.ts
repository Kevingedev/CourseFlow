import { computed, shallowRef, watch } from 'vue'
import { es } from './locales/es'
import { en } from './locales/en'
import { eu } from './locales/eu'
import type { LocaleCode, LocaleOption, TranslationDictionary } from './types'

const storageKey = 'courseflow.locale'

const dictionaries: Record<LocaleCode, TranslationDictionary> = {
  es,
  en,
  eu,
}

export const localeOptions: LocaleOption[] = [
  { code: 'es', label: 'Castellano', shortLabel: 'ES' },
  { code: 'en', label: 'English', shortLabel: 'EN' },
  { code: 'eu', label: 'Euskara', shortLabel: 'EU' },
]

const defaultLocale: LocaleCode = 'es'

const isLocaleCode = (value: string | null): value is LocaleCode => {
  return value !== null && value in dictionaries
}

const getInitialLocale = (): LocaleCode => {
  if (typeof window === 'undefined') {
    return defaultLocale
  }

  const storedLocale = window.localStorage.getItem(storageKey)

  if (isLocaleCode(storedLocale)) {
    return storedLocale
  }

  const browserLocale = window.navigator.language.slice(0, 2)
  return isLocaleCode(browserLocale) ? browserLocale : defaultLocale
}

const currentLocale = shallowRef<LocaleCode>(getInitialLocale())

const interpolate = (message: string, params?: Record<string, string | number>): string => {
  if (!params) {
    return message
  }

  return Object.entries(params).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    message,
  )
}

const setLocale = (locale: LocaleCode) => {
  currentLocale.value = locale
}

const t = (key: string, params?: Record<string, string | number>): string => {
  const activeDictionary = dictionaries[currentLocale.value]
  const fallbackDictionary = dictionaries[defaultLocale]
  return interpolate(activeDictionary[key] ?? fallbackDictionary[key] ?? key, params)
}

watch(
  currentLocale,
  (locale) => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale
    }

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(storageKey, locale)
    }
  },
  { immediate: true },
)

export const useI18n = () => ({
  locale: computed(() => currentLocale.value),
  localeOptions,
  setLocale,
  t,
})

export type { LocaleCode }
