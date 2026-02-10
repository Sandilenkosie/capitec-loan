import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { createApp, createRouter } from "h3";
import { toNodeHandler } from "h3/node";
import stubsHandler from "./src/server/api/stubs/[...].js";

const stubsPlugin = () => ({
  name: "local-stubs",
  configureServer(server) {
    const app = createApp();
    const router = createRouter();
    router.all("/**", stubsHandler);
    app.use(router.handler);
    server.middlewares.use("/api/stubs", toNodeHandler(app));
  },
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const useStubs =
    env.VITE_USE_STUBS === "true" ||
    env.ENVIRONMENT === "cypress" ||
    !env.VITE_PLATFORM_API;

  return {
    base: "/",
    server: {
      host: "::",
      port: 8080,
      open: true,
    },
    plugins: [
      react(),
      mode === "development" && componentTagger(),
      mode === "development" && useStubs && stubsPlugin(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          entryFileNames: "index.js",
          chunkFileNames: "chunk-[name].js",
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith(".css")) {
              return "index.css";
            }
            return "asset-[name][extname]";
          },
        },
      },
    },
  };
});
