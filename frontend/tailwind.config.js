export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Enny's Brand Colors
        'ennys-dark': '#1a3a2a',    // Dunkles Waldgrün
        'ennys-green': '#2d5016',   // Primär Grün
        'ennys-light': '#3d6b24',   // Helleres Grün
        'ennys-cream': '#f5f1e8',   // Beige/Creme
        'ennys-brown': '#4a3728',   // Dunkelbraun
        'ennys-gold': '#C9A961',    // Gold/Orange für CTAs
      },
      fontFamily: {
        'display': ['Georgia', 'serif'],
        'body': ['system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
