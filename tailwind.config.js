/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'hero-pattern': "url('/src/assets/images/banner.png')",
        'bannercopy': "url('/src/assets/images/bannercopy.png')",
        'about-banner': "url('/src/assets/images/about.png')",
        'contact-banner': "url('/src/assets/images/contact.png')",
        'cameraman': "url('/src/assets/images/cameraman.png')",
        'footer-texture': "url('/img/footer-texture.png')",
      },
      colors: {
        primary: '#FF6363',
        secondary: {
          100: '#E2E2D5',
          200: '#888883',
        },
        custom : {
          100: '#0275CC',
        },
      },
    },
  },
  plugins: [],
}
