import { defineEventHandler, getRequestURL, setResponseStatus } from "h3";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { findFixture, fixtureRegistry } from "../../utils/stubs.js";
import { logger } from "../../utils/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fixturesRoot = path.resolve(
  __dirname,
  "../../../../cypress/fixtures/api/data",
);

const loadFixture = async (fixturePath) => {
  if (!fixturePath) return null;
  const resolvedPath = path.resolve(fixturesRoot, fixturePath);
  const raw = await readFile(resolvedPath, "utf-8");
  return JSON.parse(raw);
};

const withPrefixRemoved = (pathname) =>
  pathname.replace(/^\/api\/stubs/, "") || "/";

export default defineEventHandler(async (event) => {
  const { pathname } = getRequestURL(event);
  const method = event.node.req.method?.toUpperCase() ?? "GET";
  const stubPath = withPrefixRemoved(pathname);

  const fixtures = fixtureRegistry[method] || [];
  const fixture = await findFixture(fixtures, event);

  if (!fixture) {
    setResponseStatus(event, 404);
    logger.warn("No stub matched", { method, stubPath });
    return {
      error: "Stub not found",
      available: fixtures.map((entry) => entry.pathPattern),
    };
  }

  if (fixture.staticResponse) {
    setResponseStatus(event, fixture.staticResponse.statusCode ?? 200);
    logger.info("Stub static response", { method, stubPath });
    return fixture.staticResponse.body ?? null;
  }

  let fixturePayload;
  try {
    fixturePayload = await loadFixture(fixture.fixturePath);
  } catch (error) {
    setResponseStatus(event, 500);
    logger.error("Failed to load fixture", {
      method,
      stubPath,
      fixturePath: fixture.fixturePath,
      error: error?.message ?? error,
    });
    return {
      error: "Failed to load fixture",
      fixturePath: fixture.fixturePath,
    };
  }
  const fixtureData = fixturePayload?.data ?? fixturePayload ?? null;
  setResponseStatus(event, fixturePayload?.status ?? 200);
  logger.info("Stub response", {
    method,
    stubPath,
    fixturePath: fixture.fixturePath,
  });
  return fixtureData;
});
