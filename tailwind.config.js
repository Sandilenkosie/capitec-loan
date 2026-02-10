import tailwindcssAnimate from "tailwindcss-animate";
import plugin from "tailwindcss/plugin";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
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
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        capitec: {
          DEFAULT: "#005B94",
          blue: "#005B94",
          "blue-light": "#00A1E0",
          red: "#C8102E",
          "red-light": "#E03C31",
          black: "#000000",
        },
      },
      fontFamily: {
        sans: ["Inter var", "sans-serif"],
        display: ["Poppins", "sans-serif"],
      },
      borderRadius: {
        xs: "0.125rem",
        sm: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        circle: "50%",
        pill: "9999px",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        float: {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },
        "pulse-slow": {
          "0%, 100%": {
            opacity: "1",
          },
          "50%": {
            opacity: "0.8",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-in-left": {
          "0%": {
            opacity: "0",
            transform: "translateX(-20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        "fade-in-right": {
          "0%": {
            opacity: "0",
            transform: "translateX(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 3s ease-in-out infinite",
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
        "fade-in": "fade-in 0.7s ease-out",
        "fade-in-left": "fade-in-left 0.7s ease-out",
        "fade-in-right": "fade-in-right 0.7s ease-out",
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
    plugin(function ({ addComponents, theme }) {
      const capitecBlue = theme("colors.capitec.blue") || "#005B94";
      const capitecBlueLight = theme("colors.capitec.blue-light") || "#00A1E0";

      addComponents({
        ".btn-capitec": {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: theme("spacing.2"),
          padding: `${theme("spacing.2")} ${theme("spacing.4")}`,
          height: theme("spacing.9"),
          borderRadius: theme("borderRadius.md"),
          backgroundColor: capitecBlue,
          color: theme("colors.white"),
          fontWeight: theme("fontWeight.medium"),
          transitionProperty:
            "background-color, box-shadow, opacity, transform",
          transitionDuration: "200ms",
        },
        ".btn-capitec:hover": {
          backgroundColor: capitecBlueLight,
        },
        ".btn-capitec-outline": {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: theme("spacing.2"),
          padding: `${theme("spacing.2")} ${theme("spacing.4")}`,
          height: theme("spacing.9"),
          borderRadius: theme("borderRadius.md"),
          backgroundColor: "transparent",
          color: capitecBlue,
          borderWidth: "1px",
          borderColor: capitecBlue,
          fontWeight: theme("fontWeight.medium"),
          transitionProperty: "background-color, color, box-shadow",
          transitionDuration: "200ms",
        },
        ".btn-capitec-outline:hover": {
          backgroundColor: capitecBlue,
          color: theme("colors.white"),
        },
      });
    }),
  ],
};
