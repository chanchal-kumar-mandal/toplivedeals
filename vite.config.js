import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // FIX: Add the 'base' property for GitHub Pages deployment.
  // Replace 'YOUR_REPO_NAME' with the actual name of your GitHub repository.
  // Example: If your repo is 'toplivedeal', it would be '/toplivedeals/'
  base: '/',
});