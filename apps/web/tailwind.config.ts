// apps/web/tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
	// Adicione esta linha:
	darkMode: "class",

	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		// ...
	},
	plugins: [],
};
export default config;
