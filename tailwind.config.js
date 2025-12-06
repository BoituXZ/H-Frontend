// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        // Primary: Honey/Orange (Warmth, Growth, Energy)
        honey: {
          50: "#FFF8E7", // Lightest cream
          100: "#FFEFC0",
          200: "#FFE49A",
          300: "#FFD874",
          400: "#FFCC4D",
          500: "#FFB800", // Primary honey
          600: "#E6A600",
          700: "#CC9400",
          800: "#B38200",
          900: "#8C6600", // Deep amber
        },

        // Secondary: Blue (Trust, Stability, Financial Security)
        hive: {
          50: "#E8F4F8",
          100: "#B8DDE8",
          200: "#88C6D8",
          300: "#58AFC8",
          400: "#3D9BB8",
          500: "#2C7A9B", // Primary blue
          600: "#246582",
          700: "#1D5169",
          800: "#163D50",
          900: "#0F2937",
        },

        // Neutrals: Warm backgrounds
        cream: {
          50: "#FDFCFB", // Almost white
          100: "#FAF8F5", // Main background
          200: "#F5F2ED",
          300: "#EBE6DD",
          400: "#DDD6C8",
          500: "#C8BFB0",
        },

        // Supporting colors
        success: {
          light: "#D4EDDA",
          DEFAULT: "#28A745",
          dark: "#1E7E34",
        },
        warning: {
          light: "#FFF3CD",
          DEFAULT: "#FFC107",
          dark: "#E0A800",
        },
        danger: {
          light: "#F8D7DA",
          DEFAULT: "#DC3545",
          dark: "#C82333",
        },

        // Text colors
        text: {
          primary: "#2D2D2D", // Almost black
          secondary: "#5A5A5A", // Gray
          tertiary: "#8C8C8C", // Light gray
          inverse: "#FFFFFF", // White
        },
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Poppins", "Inter", "sans-serif"], // For headers
      },

      boxShadow: {
        soft: "0 2px 15px rgba(255, 184, 0, 0.08)",
        honey: "0 4px 20px rgba(255, 184, 0, 0.15)",
        hive: "0 4px 20px rgba(44, 122, 155, 0.15)",
        card: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)",
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
