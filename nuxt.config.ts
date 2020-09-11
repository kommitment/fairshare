import { Configuration } from '@nuxt/types'

// https://nuxtjs.org/guides/configuration-glossary/configuration-build#publicpath
const publicPath = 'https://kommitment.github.io/fairshare/'

const config: Configuration = {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
  },

  srcDir: 'src',

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },

  /*
   ** Global CSS
   */
  css: ['@/assets/scss/main.scss'],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['@/plugins/bootstrap'],

  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ['@nuxt/typescript-build'],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
  ],

  build: {
    publicPath,
    extend(config: any, ctx: any) {
      if (ctx.isDev && ctx.isClient) {
        config.devtool = 'source-map'
      }
    },
  },
}

export default config
