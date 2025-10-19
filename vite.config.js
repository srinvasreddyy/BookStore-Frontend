import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    tailwindcss(),
    react(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://bookstore-server-tg0m.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
