import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path'; // 🚀 Added this to handle folder paths

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'robots.txt', 'hero-image.jpg'],
      manifest: {
        name: 'Rafiki House Nanyuki',
        short_name: 'Rafiki House',
        description: 'Luxury Safari Stays in Nanyuki, Kenya',
        theme_color: '#001F3F',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'favicon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      // 🚀 This tells Vite that @/ means the src/ directory
      "@": path.resolve(__dirname, "./src"),
    },
  },
});