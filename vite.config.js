// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      // Example: Proxy requests starting with /api to an external API
      '/api': {
        target: 'https://api.example.com', // Target API URL
        changeOrigin: true, // Change the origin of the host header to the target
        rewrite: (path) => path.replace(/^\/api/, ''), // Optional: Rewrite the path if necessary
      },
    },
  },
});