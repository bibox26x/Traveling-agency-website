/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr', 'ar'],
    localeDetection: false,
  },
  defaultNS: 'common',
  localePath: './public/locales',
  reloadOnPrerender: true,
  react: {
    useSuspense: false
  },
  detection: {
    order: ['cookie', 'path', 'navigator'],
    lookupCookie: 'NEXT_LOCALE',
    caches: ['cookie']
  }
} 