/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors:{
        primary:'#2F4F4F'
      }
    },
  },
  plugins: [],
  corePlugins:{
    preflight:false
  }
}