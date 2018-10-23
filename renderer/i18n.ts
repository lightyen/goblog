
import en_US from "./locales/en-US"
import zh_TW from "./locales/zh-TW"
import intl from "react-intl-universal"

export const locales = {
  "en-US": en_US,
  "zh-TW": zh_TW,
}

const defaultLocale = "en-US"

export function getLocale(): string {
    if (navigator.language) {
        localStorage.setItem("lang", navigator.language)
    }
    const lang = localStorage.getItem("lang")
    if (lang && locales[lang]) {
        return lang
    }
    localStorage.setItem("lang", defaultLocale)
    return defaultLocale
}

export function init(): Promise<void> {
    return intl.init({ currentLocale: getLocale(), locales })
}

// https://github.com/i18next/react-i18next/tree/master/example/react

// import i18n from 'i18next';
// import Backend from 'i18next-xhr-backend';
// import LanguageDetector from 'i18next-browser-languagedetector';

// i18n
//     .use(Backend)
//     .use(LanguageDetector)
//     .init({
//         debug: true, // show debug information
//         ns: ['common', 'namespace2'],
//         defaultNS: "common",
//         fallbackLng: {
//             'zh-TW': ['zh', 'en'],
//             "default": ['en'],
//         },
//         interpolation: {
//             // escapeValue: false, // not needed for react!!
//         },
//         react: {
//             wait: true,
//         },
//         backend: {
//             "loadPath": "/assets/locales/{{ns}}/{{lng}}.json"
//         }
//     })

// export default i18n
