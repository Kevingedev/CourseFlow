export type LocaleCode = 'es' | 'en'

export type TranslationDictionary = Record<string, string>

export interface LocaleOption {
  code: LocaleCode
  label: string
  shortLabel: string
}
