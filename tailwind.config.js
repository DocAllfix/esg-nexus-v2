/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        teal: {
          DEFAULT: "hsl(174 83% 26%)",
          light: "hsl(174 72% 40%)",
          dark: "hsl(175 62% 19%)",
        },
        esg: {
          e: "hsl(174 83% 26%)",
          s: "hsl(264 70% 50%)",
          g: "hsl(214 45% 26%)",
        },
        severity: {
          critico: "hsl(0 72% 42%)",
          alto: "hsl(25 90% 45%)",
          medio: "hsl(43 90% 44%)",
          basso: "hsl(90 55% 40%)",
        },
        chart: {
          1: "hsl(var(--chart-1, 174 83% 26%))",
          2: "hsl(var(--chart-2, 264 70% 50%))",
          3: "hsl(var(--chart-3, 214 45% 26%))",
          4: "hsl(var(--chart-4, 43 90% 44%))",
          5: "hsl(var(--chart-5, 25 90% 45%))",
        },
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
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "slide-in-right": "slide-in-right 0.25s ease-out",
      },
      safelist: [
        "bg-esg-e", "bg-esg-s", "bg-esg-g",
        "text-esg-e", "text-esg-s", "text-esg-g",
        "border-esg-e", "border-esg-s", "border-esg-g",
        "bg-severity-critico", "bg-severity-alto", "bg-severity-medio", "bg-severity-basso",
        "text-severity-critico", "text-severity-alto", "text-severity-medio", "text-severity-basso",
      ],
    },
  },
  plugins: [require("tailwindcss-animate")],
};
