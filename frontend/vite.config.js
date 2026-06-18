import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Proxy API calls to the local backend during development
      // (the backend defaults to port 8000). Edit the target if yours differs.
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});
