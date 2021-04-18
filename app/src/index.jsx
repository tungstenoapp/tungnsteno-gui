import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import i18n from 'i18next'

import '../node_modules/uikit/dist/css/uikit.min.css'
import '../node_modules/uikit/dist/js/uikit.min.js'
import './Styles/common.css'

import common_en from './Locale/Translations/en/common.json'
import common_es from './Locale/Translations/es/common.json'
import common_andaluh from './Locale/Translations/andaluh/common.json'

import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  .init({
    resources: {
      en: {
        common: common_en
      },
      es: {
        common: common_es
      },
      andaluh: {
        common: common_andaluh
      }
    },
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false
    }
  })

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
