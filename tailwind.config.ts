import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Zen color palette - references existing CSS variables
        zen: {
          bg: "var(--paper-bg)",
          surface: "var(--paper-surface)",
          elevated: "var(--paper-elevated)",
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          border: "var(--accent-border)",
          accent: "var(--accent-brown)",
          "accent-hover": "var(--accent-amber)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "serif"],
      },
      borderRadius: {
        zen: "0.5rem",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
export default config
