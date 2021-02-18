import colors from 'vuetify/es5/util/colors'
require('dotenv').config()

export default {

  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,
  
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    //titleTemplate: '%s - ' + process.env.npm_package_name,
    titleTemplate: '%s',
    title: process.env.TITLE || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.DESCRIPTION || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/main.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/axios',
    '~/plugins/pracktica'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/dotenv'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    /*
    workbox: {
      workboxURL:
        'https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js',
      runtimeCaching: [
        {
          urlPattern: 'https://fonts.googleapis.com/.*',
          handler: 'staleWhileRevalidate',
          method: 'GET',
          strategyOptions: {
            cacheName: 'fonts',
            cacheExpiration: {
              maxEntries: 10,
              maxAgeSeconds: 30000
            },
            cacheableResponse: { statuses: [0, 200] }
          }
        }
      ]
    },
    */
    icon: {
      fileName: 'logo_auteacher.png'
    },
    manifest: {
      name: 'app.auteacher.com',
      short_name: 'AuTeacher',
      description:
        'Automatic Teacher - Sistema de apoyo en el proceso educativo',
      lang: 'es',
      start_url: '/'
    },
    meta: {
      author: 'Disarrollo Software SAS',
      name: 'AuTeacher',
      description:
        'Automatic Teacher',
      lang: 'es'
    }
  },



  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {},

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    },
    defaultAssets: {
      font: false,
      icons: 'mdi'
    },
    treeShake: true,
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
