// apps/web/tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
	// MUDANÇA CRÍTICA: Usamos um array para forçar a estratégia de classe.
	// Isso resolve a incompatibilidade que faz o Tailwind ignorar a configuração.
	darkMode: ["class", '[data-theme="dark"]'],

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
