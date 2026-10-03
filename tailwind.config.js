export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'hero-pattern': "url('/src/assets/images/banner.png')",
        bannercopy: "url('/src/assets/images/bannercopy.png')",
        'about-banner': "url('/src/assets/images/about.png')",
        'contact-banner': "url('/src/assets/images/contact.png')",
      },
    },
  },
  plugins: [],
};
