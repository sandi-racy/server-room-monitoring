import tailwindcss from '@tailwindcss/vite'
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  devServer: {
    port: 4001
  },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  app: {
    head: {
        title: 'Monitoring Ruang Server',
      htmlAttrs: {
        'data-theme': 'light'
      }
    }
  },
  modules: [
    'nuxt-vuefire',
  ],
  vuefire: {
    config: {
        apiKey: "AIzaSyCN_xen2qG0ZIIVKFBgHvRpTijK8_Bph-c",
        authDomain: "smart-electric-metering-10f64.firebaseapp.com",
        databaseURL:
          "https://smart-electric-metering-10f64-default-rtdb.firebaseio.com",
        projectId: "smart-electric-metering-10f64",
        storageBucket: "smart-electric-metering-10f64.firebasestorage.app",
        messagingSenderId: "752778610630",
        appId: "1:752778610630:web:e6ca55c5dc9f57ec9c54c7",
    },
  },
})