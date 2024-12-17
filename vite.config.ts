import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "build",
  },
  server: {
    proxy: {
      "/api": {
        target:
          process.env.PROXY_BACKEND === "true"
            ? "https://redditplaylistgenerator-dev-fubjhzake9adape6.norwayeast-01.azurewebsites.net"
            : "https://localhost:7006",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
