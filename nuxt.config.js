const firebaseKey = require('./firebase.key.json');
module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'onsen',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },
    vendor: ['onsenui', 'vue-onsenui','firebase']
    
  },

  env: {
    FIREBASE_KEY: JSON.stringify(firebaseKey),
  },
  
  css: [
    'onsenui/css/onsenui.css',
    'onsenui/css/onsen-css-components.css'
  ],

  plugins: [{src: '~/plugins/onsenui', ssr: true}],

}
