// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    runtimeConfig: {
        public: {
            WEATHER_APP: process.env.WEATHER_APP,
            IPGEOLOCATION_KEY: process.env.IPGEOLOCATION_KEY,
        }
    },

    postcss: {
        plugins: {
        tailwindcss: {},
        autoprefixer: {},
        },
    },
    css: [
        '~/assets/css/main.css',
      ],
})
