import { createApp, getRequestURL, setHeader, setResponseStatus } from "h3";
import { toNodeHandler } from "h3/node";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

import stubsHandler from "./src/server/api/stubs/[...].js";

const distRoot = path.resolve(process.cwd(), "dist");
const port = Number(process.env.PORT || 8080);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".eot": "application/vnd.ms-fontobject",
};

const resolveStaticPath = (pathname) => {
  const sanitized = pathname.replace(/^\/+/, "");
  const joined = path.join(distRoot, sanitized);
  const normalized = path.normalize(joined);
  if (!normalized.startsWith(distRoot)) {
    return null;
  }
  return normalized;
};

const tryServeFile = async (event, filePath) => {
  if (!filePath) return false;
  try {
    const fileStat = await stat(filePath);
    if (fileStat.isDirectory()) {
      return false;
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = contentTypes[ext] || "application/octet-stream";
    setHeader(event, "Content-Type", contentType);
    setHeader(event, "Content-Length", String(fileStat.size));
    const body = await readFile(filePath);
    return body;
  } catch (error) {
    if (error?.code === "ENOENT") {
      return false;
    }
    throw error;
  }
};

const app = createApp();

app.use(async (event) => {
  const { pathname } = getRequestURL(event);

  if (pathname.startsWith("/api/stubs")) {
    return stubsHandler(event);
  }

  const assetPath = resolveStaticPath(pathname);
  const assetResponse = await tryServeFile(event, assetPath);
  if (assetResponse !== false) {
    return assetResponse;
  }

  const indexPath = path.join(distRoot, "index.html");
  const indexResponse = await tryServeFile(event, indexPath);
  if (indexResponse !== false) {
    return indexResponse;
  }

  setResponseStatus(event, 404);
  return "Not Found";
});

createServer(toNodeHandler(app)).listen(port, "0.0.0.0", () => {
  console.log(`Server listening on http://0.0.0.0:${port}`);
});
