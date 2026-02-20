import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
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
        theme_color: '#1e3c72',
        background_color: '#1e3c72',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
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
      // Deshabilitar completamente el service worker para evitar ERR_CONNECTION_REFUSED en móvil
      // Solo funciona en web, no en Capacitor
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

