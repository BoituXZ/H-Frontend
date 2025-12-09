// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        // Primary: "Honey" is now RED (#eb2528)
        honey: {
          50: "#fff5f5",
          100: "#ffe3e3",
          200: "#ffc9c9",
          300: "#ffa5a5",
          400: "#fa6e6e",
          500: "#eb2528", // Base Brand Red
          600: "#c91a1d",
          700: "#a61214",
          800: "#850f11",
          900: "#6e1012",
        },

        // Secondary: "Hive" is now BLUE (#075ca8)
        hive: {
          50: "#f0f7ff",
          100: "#e0effe",
          200: "#b9dffc",
          300: "#7cc2fa",
          400: "#36a2f5",
          500: "#075ca8", // Base Brand Blue
          600: "#044b8a",
          700: "#043c6f",
          800: "#05335c",
          900: "#082b4b",
        },

        // Neutrals: "Cream" is now WHITE/SLATE (#ffffff)
        cream: {
          50: "#ffffff", // Pure White
          100: "#f8fafc",
          200: "#f1f5f9",
          300: "#e2e8f0",
          400: "#cbd5e1",
          500: "#94a3b8",
        },

        // Supporting colors
        success: {
          light: "#dcfce7",
          DEFAULT: "#22c55e",
          dark: "#15803d",
        },
        warning: {
          light: "#fef9c3",
          DEFAULT: "#eab308",
          dark: "#a16207",
        },
        danger: {
          light: "#fee2e2",
          DEFAULT: "#ef4444",
          dark: "#b91c1c",
        },

        // Text colors (Slate scale)
        text: {
          primary: "#0f172a", // Slate 900
          secondary: "#475569", // Slate 600
          tertiary: "#94a3b8", // Slate 400
          inverse: "#ffffff",
        },
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Poppins", "Inter", "sans-serif"],
      },

      boxShadow: {
        // Red Glow
        soft: "0 2px 15px rgba(235, 37, 40, 0.05)",
        honey: "0 4px 20px rgba(235, 37, 40, 0.15)",
        // Blue Glow
        hive: "0 4px 20px rgba(7, 92, 168, 0.15)",
        card: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
      },

      borderRadius: {
        hive: "12px",
        card: "16px",
      },

      animation: {
        "pulse-soft": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "slide-up": "slideUp 0.3s ease-out",
        "fade-in": "fadeIn 0.5s ease-in",
      },

      keyframes: {
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
