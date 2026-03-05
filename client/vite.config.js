import { defineConfig } from "vite";

// simple proxy so that client code can call `/weather` without CORS
// the dev server will forward requests to the Node backend running on 3000
export default defineConfig({
  server: {
    proxy: {
      "/weather": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      // add other proxies as needed, e.g.:
      // "/api": "http://localhost:3000"
    },
  },
});
