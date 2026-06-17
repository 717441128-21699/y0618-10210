/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        lg: "2rem",
        xl: "3rem",
      },
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      colors: {
        primary: {
          50: "#EFF4FA",
          100: "#D7E2EF",
          200: "#AFC5DD",
          300: "#87A8CA",
          400: "#5F8AB8",
          500: "#376DA6",
          600: "#1E3A5F",
          700: "#18304F",
          800: "#12263F",
          900: "#0C1C2F",
          950: "#060E18",
        },
        accent: {
          orange: {
            50: "#FFF0EA",
            100: "#FFDBCC",
            200: "#FFB799",
            300: "#FF9366",
            400: "#FF6F33",
            500: "#FF6B35",
            600: "#E5541F",
            700: "#B34218",
          },
          mint: {
            50: "#EFFBF9",
            100: "#D4F4F0",
            200: "#A9E9E1",
            300: "#7EDFD2",
            400: "#53D4C3",
            500: "#4ECDC4",
            600: "#3BB3AB",
            700: "#2A857F",
          },
          yellow: {
            50: "#FFFBE8",
            100: "#FFF4C2",
            200: "#FFEA85",
            300: "#FFDF48",
            400: "#FFD719",
            500: "#FFE66D",
            600: "#E6CA33",
            700: "#B3A62A",
          },
        },
        surface: {
          bg: "#F5F5F7",
          card: "#FFFFFF",
          border: "#E5E7EB",
          muted: "#9CA3AF",
        },
        text: {
          primary: "#1A1A2E",
          secondary: "#4A4A68",
          tertiary: "#6B7280",
        },
      },
      fontFamily: {
        sans: [
          '"Noto Sans SC"',
          "-apple-system",
          "BlinkMacSystemFont",
          '"PingFang SC"',
          '"Microsoft YaHei"',
          "sans-serif",
        ],
        mono: ['"Sarasa Mono SC"', '"JetBrains Mono"', "Consolas", "monospace"],
      },
      fontSize: {
        xs: ["12px", "18px"],
        sm: ["14px", "22px"],
        base: ["16px", "26px"],
        lg: ["18px", "30px"],
        xl: ["20px", "32px"],
        "2xl": ["24px", "36px"],
        "3xl": ["30px", "44px"],
        "4xl": ["36px", "52px"],
      },
      borderRadius: {
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
        "3xl": "28px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover": "0 10px 25px rgba(30,58,95,0.1), 0 4px 10px rgba(30,58,95,0.06)",
        button: "0 2px 6px rgba(255,107,53,0.35)",
        "button-hover": "0 6px 16px rgba(255,107,53,0.45)",
        elevation: "0 20px 40px rgba(30,58,95,0.15)",
      },
      backgroundImage: {
        "gradient-primary":
          "linear-gradient(135deg, #1E3A5F 0%, #376DA6 100%)",
        "gradient-accent":
          "linear-gradient(135deg, #FF6B35 0%, #FFB347 100%)",
        "gradient-mint":
          "linear-gradient(135deg, #4ECDC4 0%, #7EDFD2 100%)",
        "gradient-hero":
          "linear-gradient(135deg, #1E3A5F 0%, #376DA6 45%, #4ECDC4 100%)",
        "card-glow":
          "radial-gradient(circle at top right, rgba(78,205,196,0.15), transparent 60%)",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.5s ease-out both",
        "fade-in": "fadeIn 0.4s ease-out both",
        "slide-in-right": "slideInRight 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        "scale-in": "scaleIn 0.2s ease-out",
        "breathe": "breathe 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(24px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.96)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        breathe: {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      transitionTimingFunction: {
        "bounce-subtle": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};
