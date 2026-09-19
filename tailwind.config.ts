import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111214", // near-black, primary text/background
        charcoal: "#1B1C1F", // secondary dark surface
        paper: "#F6F5F2", // off-white background
        bone: "#EAE8E2", // subtle warm grey surface
        line: "#DAD7CF", // hairline borders on light surfaces
        lineDark: "#2E2F33", // hairline borders on dark surfaces
        brass: "#9C7A3C", // muted metallic accent (from the real AA logo gold)
        signal: "#2F6F4F", // deep green for availability / success
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      maxWidth: {
        content: "1200px",
      },
      letterSpacing: {
        tightest: "-0.03em",
      },
    },
  },
  plugins: [],
};

export default config;
