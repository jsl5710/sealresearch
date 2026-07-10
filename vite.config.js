import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Set base to '/sealresearch/' if deploying to https://<user>.github.io/sealresearch/,
// or leave as '/' if using a custom domain / user-page root.
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [
    react(),
    tailwindcss(),
  ],
});
