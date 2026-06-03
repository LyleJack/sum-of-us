import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig(({ command, mode }) => {
  const plugins = [tailwindcss()];

  if (command === "build" || mode === "cloudflare") {
    plugins.push(cloudflare());
  }

  return {
    plugins,
    server: {
      port: 5173,
      strictPort: true,
      allowedHosts: ["localhost", "sum-of-us-dev.sumofusdev.workers.dev"],
    },
  };
});
