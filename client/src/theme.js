import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#EBF8FF" },
          100: { value: "#BEE3F8" },
          200: { value: "#90CDF4" },
          300: { value: "#63B3ED" },
          400: { value: "#4299E1" },
          500: { value: "#3182CE" },
          600: { value: "#2B6CB0" },
          700: { value: "#2C5282" },
          800: { value: "#2A4365" },
          900: { value: "#1A365D" },
        },
        accent: {
          50: { value: "#E6FFFA" },
          100: { value: "#B2F5EA" },
          200: { value: "#81E6D9" },
          300: { value: "#4FD1C5" },
          400: { value: "#38B2AC" },
          500: { value: "#319795" },
          600: { value: "#2C7A7B" },
          700: { value: "#285E61" },
          800: { value: "#234E52" },
          900: { value: "#1D4044" },
        },
        surface: {
          50: { value: "#FAFBFC" },
          100: { value: "#F7FAFC" },
          200: { value: "#EDF2F7" },
          300: { value: "#E2E8F0" },
          400: { value: "#CBD5E0" },
          500: { value: "#A0AEC0" },
          600: { value: "#718096" },
          700: { value: "#4A5568" },
          800: { value: "#2D3748" },
          900: { value: "#1A202C" },
        },
      },
      fonts: {
        heading: { value: "'Inter', system-ui, -apple-system, sans-serif" },
        body: { value: "'Inter', system-ui, -apple-system, sans-serif" },
      },
      radii: {
        sm: { value: "6px" },
        md: { value: "8px" },
        lg: { value: "12px" },
        xl: { value: "16px" },
        "2xl": { value: "20px" },
        "3xl": { value: "24px" },
      },
      shadows: {
        xs: { value: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" },
        sm: { value: "0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.04)" },
        md: { value: "0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.04)" },
        lg: { value: "0 10px 15px -3px rgba(0, 0, 0, 0.06), 0 4px 6px -4px rgba(0, 0, 0, 0.04)" },
        xl: { value: "0 20px 25px -5px rgba(0, 0, 0, 0.06), 0 8px 10px -6px rgba(0, 0, 0, 0.04)" },
        soft: { value: "0 2px 8px rgba(49, 130, 206, 0.08)" },
        card: { value: "0 1px 3px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.04)" },
        elevated: { value: "0 4px 20px rgba(49, 130, 206, 0.12)" },
      },
    },
  },
  globalCss: {
    "html, body": {
      bg: "#F7FAFC",
      color: "#2D3748",
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      lineHeight: "1.6",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
    },
    "*": {
      boxSizing: "border-box",
    },
    "a": {
      color: "inherit",
      textDecoration: "none",
    },
    "::-webkit-scrollbar": {
      width: "6px",
    },
    "::-webkit-scrollbar-track": {
      background: "transparent",
    },
    "::-webkit-scrollbar-thumb": {
      background: "#CBD5E0",
      borderRadius: "10px",
    },
    "::-webkit-scrollbar-thumb:hover": {
      background: "#A0AEC0",
    },
  },
});

export const system = createSystem(defaultConfig, config);
