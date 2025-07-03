// apps/web/tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
	// CORREÇÃO: Voltamos para a configuração padrão e mais robusta para next-themes.
	darkMode: "class",

	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {},
	},
	plugins: [require("@tailwindcss/typography")],
};
export default config;
