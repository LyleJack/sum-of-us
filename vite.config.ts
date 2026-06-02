import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    port: 5173,
    strictPort: true,
    allowedHosts: ["localhost",'https://sum-of-us-dev.sumofusdev.workers.dev'],
  },
});
