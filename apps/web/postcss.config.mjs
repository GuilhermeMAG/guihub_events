// apps/web/postcss.config.mjs
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // MUDANÇA CRÍTICA: Usamos o novo pacote aqui
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};

export default config;