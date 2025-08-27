import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            keyframes: {
                // (0, 4px) → (4px, 0) → (0, -4px) → (-4px, 0) → (4px, 0)
                "shadow-rotate": {
                    "0%": {
                        boxShadow:
                            "0 4px 20px rgba(255,255,255,0.8)",
                    },
                    "25%": {
                        boxShadow:
                            "6px 0 20px rgba(255,255,255,0.8)",
                    },
                    "50%": {
                        boxShadow:
                            "0 -8px 20px rgba(255,255,255,0.8)",
                    },
                    "75%": {
                        boxShadow:
                            "-6px 0 20px rgba(255,255,255,0.8)",
                    },
                    "100%": {
                        boxShadow:
                            "4px 0 20px rgba(255,255,255,0.8)",
                    },
                },
                "shadow-rotate-back": {
                    "0%": {
                        boxShadow:
                            "4px 0 20px rgba(255,255,255,0.8)",
                    },
                    "25%": {
                        boxShadow:
                            "0 -6px 20px rgba(255,255,255,0.8)",
                    },
                    "50%": {
                        boxShadow:
                            "-8px 0 20px rgba(255,255,255,0.8)",
                    },
                    "75%": {
                        boxShadow:
                            "0px 6px 20px rgba(255,255,255,0.8)",
                    },
                    "100%": {
                        boxShadow:
                            "0 4px 20px rgba(255,255,255,0.8)",
                    },
                },
            },
            animation: {
                // 200ms 동안 한 번 재생, 끝난 상태 유지(forwards)
                "shadow-spin-once":
                    "shadow-rotate 500ms ease-in-out forwards",
                "shadow-spin-back":
                    "shadow-rotate-back 500ms ease-out forwards",
            },
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
        },
    },
    plugins: [],
};
export default config;
