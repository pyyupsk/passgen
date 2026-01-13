import sitemap from "@pyyupsk/vite-plugin-sitemap";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import path from "node:path";
import unused from "unplugin-unused/vite";
import router from "unplugin-vue-router/vite";
import { defineConfig } from "vite";
import { compression } from "vite-plugin-compression2";
import { VitePWA as pwa } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    router(),
    vue(),
    tailwindcss(),
    sitemap({
      generateRobotsTxt: true,
      hostname: "https://passgen.pyyupsk.dev",
    }),
    compression({
      algorithms: ["gzip", "brotliCompress"],
      exclude: [/\.(br)$/, /\.(gz)$/],
    }),
    pwa({
      includeAssets: ["fonts/**/*"],
      manifest: {
        background_color: "#09090b",
        description:
          "A modern, browser-based password generator with real-time strength analysis.",
        display: "standalone",
        icons: [
          {
            sizes: "192x192",
            src: "pwa-192x192.png",
            type: "image/png",
          },
          {
            sizes: "512x512",
            src: "pwa-512x512.png",
            type: "image/png",
          },
          {
            purpose: "any maskable",
            sizes: "512x512",
            src: "pwa-512x512.png",
            type: "image/png",
          },
        ],
        name: "PassGen - Secure Password Generator",
        short_name: "PassGen",
        start_url: "/",
        theme_color: "#10b981",
      },
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            handler: "CacheFirst",
            options: {
              cacheableResponse: {
                statuses: [0, 200],
              },
              cacheName: "google-fonts-cache",
              expiration: {
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                maxEntries: 10,
              },
            },
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          },
        ],
      },
    }),
    unused({
      ignore: {
        dependencies: [
          "@pyyupsk/vite-plugin-sitemap",
          "@tailwindcss/vite",
          "tailwindcss",
          "tw-animate-css",
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    cors: true,
    hmr: {
      overlay: true,
    },
    port: 3000,
  },
});
