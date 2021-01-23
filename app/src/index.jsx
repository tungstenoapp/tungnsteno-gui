import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import i18n from 'i18next'

import '../node_modules/uikit/dist/css/uikit.min.css'
import '../node_modules/uikit/dist/js/uikit.min.js'
import './Styles/common.css'

import common_en from './Locale/Translations/en/common.json'

import { initReactI18next } from 'react-i18next'

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        common: common_en // 'common' is our custom namespace
      }
    },
    lng: 'en',
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
