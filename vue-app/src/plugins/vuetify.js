// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify, ThemeDefinition
 } from 'vuetify'

const myCustomLightTheme = {
  colors: {
    
  }
}

export default createVuetify(
  // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
  {
    theme: {
      dark: false,
      themes: {
        light: {
          colors: {
            primary: "#bd2a24",
          }
        },
        dark: {
          colors: {
            primary: "#bd2a24",
          }
        }
      }
    }
  }
)
