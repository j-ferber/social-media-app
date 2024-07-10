/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: ['prettier-plugin-tailwindcss'],
  bracketSpacing: false,
  singleQuote: true,
  trailingComma: 'es5',
  arrowParens: 'avoid',
};

export default config;
