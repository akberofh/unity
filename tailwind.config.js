/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      
      // --- SİZİN MÖVCUD AYARLARINIZ ---
      colors: {
        primary: "#ffc727",
        secondary: {
          100: "#E2E2D5",
          200: "#888883",
        },
        dark: "#111111",
        'primary-dark': '#2779bd',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "3rem",
        },
      },

      // --- CYBERPUNK DİZAYNI ÜÇÜN ƏLAVƏLƏR ---
      fontFamily: {
        // JSX-də 'font-mono' istifadə etmək üçün
        mono: ['"Space Mono"', 'monospace'], 
      },
      backgroundImage: {
        // 'bg-grid-pattern' sinfi üçün
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%231d4ed8' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M0 38.697L20 40v2.005L0 40.697V38.697zM40 17.621V32h-2V17.621L40 17.621zM0 36.739V38h20v-1.261L0 36.739zM40 15.665V17h-2v-1.335L40 15.665zM0 34.681V36h20v-1.319L0 34.681zM40 13.509V15h-2v-1.491L40 13.509zM0 32.624V34h20v-1.376L0 32.624z' /%3E%3C/g%3E%3C/svg%3E\")",
      },
      animation: {
        // Mövcud 'fadeIn' ilə birləşdirildi
        fadeIn: 'fadeIn 1s ease-out',
        'grid-pulse': 'grid-pulse 7s linear infinite',
        'pulse-light': 'pulse-light 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        // Mövcud 'fadeIn' ilə birləşdirildi
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'grid-pulse': {
          '0%, 100%': { opacity: '0.1' },
          '50%': { opacity: '0.3' },
        },
        'pulse-light': {
          '0%, 100%': { opacity: 1, color: '#60a5fa' }, // blue-400
          '50%': { opacity: .7, color: '#a78bfa' }, // purple-400
        },
      },
      boxShadow: {
        // Neon parıltı effektləri üçün
        'neon-blue': '0 0 5px #2563eb, 0 0 10px #2563eb, 0 0 20px #2563eb',
        'neon-purple': '0 0 5px #9333ea, 0 0 10px #9333ea, 0 0 20px #9333ea',
        'neon-blue-sm': '0 0 2px #2563eb, 0 0 4px #2563eb',
        'inner-neon': 'inset 0 0 5px #000000, inset 0 0 5px #2563eb',
      },
    },
  },
  plugins: [],
};