import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        pawbit: {
          background: "#F8F4F4",
          surface: "#FFFFFF",
          "surface-alt": "#F3F6FB",
          stroke: "#E7EBF3",
          text: "#1E2742",
          muted: "#6B7A96",
          hint: "#9AA6BC",
          disabled: "#C6CEDC",
          primary: "#FF5A5F",
          "primary-foreground": "#FFFFFF",
          input: "#FFFFFF",
          "input-alt": "#F6F8FC",
          "error-border": "#FFB8BD",
          "chip-active": "#FFE9EA",
          "chip-active-text": "#FF5A5F",
          "chip-default": "#F2F5FA",
          "chip-default-text": "#6C7A95",
          pending: "#FFBF8F",
          success: "#1BB86D",
          "success-bg": "#DDF7E8",
          warning: "#FFBF8F",
          "warning-bg": "#FFF1DF",
          error: "#FF8F95",
          "error-bg": "#FFE8EA",
          blue: "#3F74FF",
          "blue-bg": "#E9F0FF"
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "\"Segoe UI\"", "sans-serif"]
      },
      boxShadow: {
        soft: "0 12px 30px rgba(146, 161, 185, 0.12)",
        card: "0 20px 40px rgba(120, 137, 163, 0.14)",
        coral: "0 16px 30px rgba(255, 90, 95, 0.24)"
      },
      borderRadius: {
        sm: "12px",
        md: "16px",
        lg: "20px",
        pill: "999px"
      }
    }
  },
  plugins: []
};

export default config;
