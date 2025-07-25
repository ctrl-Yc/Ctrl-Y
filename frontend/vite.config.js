import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite' 

export default defineConfig({
  plugins: [
    react(),
     tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt'],
      manifest: {
        name: 'My Vite PWA App',
        short_name: 'VitePWA',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#317EFB',
        // icons: [
        //   {
        //     src: 'pwa-192x192.png',
        //     sizes: '192x192',
        //     type: 'image/png'
        //   },
        //   {
        //     src: 'pwa-512x512.png',
        //     sizes: '512x512',
        //     type: 'image/png'
        //   }
        // ]
        workbox: {
          runtimeCaching: [
            {
              urlPattern: ({ request }) => request.destination === 'document',
              handler: 'NetworkFirst'
            },
            {
              urlPattern: ({ request }) => request.destination === 'image',
              handler: 'CacheFirst',
              options: {
                cacheName: 'images-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 30 
                }
              }
            }
          ]
        }
      }
    })
  ]
})