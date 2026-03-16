import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { readFileSync } from 'fs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));

export default defineConfig({
  base: '/impostor-dominicano/',
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(packageJson.version),
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) return 'react';
          if (id.includes('node_modules/firebase/')) return 'firebase';
          if (id.includes('palabras-dominicanas')) return 'palabras';
          if (id.includes('node_modules')) return 'vendor';
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
  plugins: [
    react(),
    // PWA deshabilitado para móvil - solo para web
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'El Impostor Dominicano',
        short_name: 'Impostor RD',
        description: 'Juego del Impostor con palabras dominicanas - Creado por Brayan Camacho',
        author: 'Brayan Camacho',
        lang: 'es',
        theme_color: '#667eea',
        background_color: '#0f0f1e',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/impostor-dominicano/',
        start_url: '/impostor-dominicano/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        // Deshabilitar actualizaciones automáticas que pueden causar problemas en móvil
        skipWaiting: false,
        clientsClaim: false,
        // No intentar conectarse a servidores externos
        runtimeCaching: []
      },
      devOptions: {
        enabled: false,
        type: 'module'
      },
      // No inyectar registro automático; se registra manualmente solo en web (main.jsx)
      injectRegister: false
    })
  ],
  server: {
    host: true,
    port: 3000,
    strictPort: false,
    open: false
  }
});

