import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#F5B800",
          foreground: "#000000",
          hover: "#FFD040",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        "obys-black": "#000",
        "obys-near-black": "#080808",
        "obys-darkest": "#0b0b0b",
        "obys-dark": "#151515",
        "obys-gold": "#F5B800",
        "obys-gold-hover": "#FFD040",
        "obys-blue": "#0f5cf1",
        "obys-blue-hover": "#276df3",
        "obys-orange": "#ff8f0a",
        "obys-border-dark": "#3e3e3e",
        "obys-border-medium": "#4a4a4a",
        "obys-text-muted": "#575757",
        "obys-text-secondary": "#a4a4a4",
        "obys-text-light": "#e6e6e6",

        yellow: {
          DEFAULT: "#F5B800",
          hover: "#FFD040",
        },
        black: "#000000",
        white: "#FFFFFF",
        gray: {
          dark: "#222222",
          light: "#F2F2F2",
          50: "#F2F2F2",
          100: "#E6E6E6",
          200: "#CCCCCC",
          300: "#B3B3B3",
          400: "#999999",
          500: "#808080",
          600: "#666666",
          700: "#4D4D4D",
          800: "#333333",
          900: "#222222",
          950: "#0D0D0D",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "crawling-line": {
          "0%": { transform: "translate3d(0, 0, 0)" },
          "100%": { transform: "translate3d(-50%, 0, 0)" },
        },
        "noise": {
          "0%, 100%": { backgroundPosition: "0 0" },
          "10%": { backgroundPosition: "-5% -10%" },
          "20%": { backgroundPosition: "-15% 5%" },
          "30%": { backgroundPosition: "7% -25%" },
          "40%": { backgroundPosition: "-5% 25%" },
          "50%": { backgroundPosition: "-15% 10%" },
          "60%": { backgroundPosition: "15% 0%" },
          "70%": { backgroundPosition: "0% 15%" },
          "80%": { backgroundPosition: "3% 35%" },
          "90%": { backgroundPosition: "-10% 10%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "crawling-line": "crawling-line var(--crawl-duration, 20s) linear infinite",
        "noise": "noise 0.5s steps(10) infinite",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
        sans: ["var(--font-body)", "sans-serif"],
        bauhaus: ["var(--font-display)", "serif"],
      },
      transitionTimingFunction: {
        "obys-default": "cubic-bezier(.3, .86, .36, .95)",
        "obys-page": "cubic-bezier(.4, 0, 0, 1)",
      },
      transitionDuration: {
        "obys": "350ms",
        "obys-page": "1500ms",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
