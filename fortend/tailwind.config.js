/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["night"],
          primary: "blue",
          secondary: "teal",
        },
      },
    ],
  },

  plugins: [require("daisyui")],
 
}

