import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

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
        icons: [
          {
            src: 'favicon.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});