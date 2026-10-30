import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Distinctive New Industrial Palette
        obsidian: {
          DEFAULT: "#111210",
          950: "#0B0C0A",
          900: "#0E0F0D",
          800: "#111210",
          700: "#151613",
        },
        charcoal: {
          DEFAULT: "#191A17",
          surface: "#22231F",
          elevated: "#2A2B26",
          border: "#2E302B",
          strong: "#3D3F38",
        },
        ivory: {
          DEFAULT: "#F2EFE7",
          warm: "#F2EFE7",
          cream: "#E8E4DA",
          secondary: "#A5A397",
          muted: "#77766D",
          faint: "#45453F",
        },
        copper: {
          DEFAULT: "#B86A43",
          burnt: "#D97745",
          amber: "#E6A15C",
          dark: "#8F4E2D",
          light: "#C87C55",
        },
        olive: {
          DEFAULT: "#A3A68A",
          muted: "#868972",
          light: "#B8BAA3",
        },
        status: {
          success: "#4E8752",
          warning: "#E6A15C",
          error: "#C95A53",
        },

        // Semantic Tokens mapped to the new palette
        background: "#111210",
        foreground: "#F2EFE7",
        card: {
          DEFAULT: "#191A17",
          foreground: "#F2EFE7",
        },
        popover: {
          DEFAULT: "#191A17",
          foreground: "#F2EFE7",
        },
        primary: {
          DEFAULT: "#B86A43",
          foreground: "#F2EFE7",
        },
        secondary: {
          DEFAULT: "#22231F",
          foreground: "#F2EFE7",
        },
        muted: {
          DEFAULT: "#22231F",
          foreground: "#A5A397",
        },
        accent: {
          DEFAULT: "#2A2B26",
          foreground: "#F2EFE7",
        },
        destructive: {
          DEFAULT: "#C95A53",
          foreground: "#F2EFE7",
        },
        border: "#2E302B",
        input: "#22231F",
        ring: "#B86A43",
      },
      borderRadius: {
        lg: "0.5rem", // 8px
        md: "0.375rem", // 6px
        sm: "0.25rem", // 4px
      },
      fontFamily: {
        sans: [
          '"Inter"',
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "sans-serif",
        ],
        mono: [
          '"JetBrains Mono"',
          '"Fira Code"',
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
        display: [
          '"Inter"',
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.4)",
        card: "0 4px 16px -2px rgba(0, 0, 0, 0.5), 0 1px 2px 0 rgba(0, 0, 0, 0.4)",
        elevated: "0 12px 32px -4px rgba(0, 0, 0, 0.6), 0 2px 6px -1px rgba(0, 0, 0, 0.4)",
        copper: "0 0 16px -2px rgba(184, 106, 67, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
