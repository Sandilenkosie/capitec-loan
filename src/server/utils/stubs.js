import * as jsonPath from "jsonpath";
import { getQuery, readBody } from "h3";
import logger from "./logger.js";

function getStubsPath(event) {
  const rawPath = event?.path || event?.node?.req?.url || "";
  const cleanPath = String(rawPath).split("?")[0];
  if (cleanPath.includes("/api/stubs/")) {
    return cleanPath;
  }
  if (cleanPath.startsWith("/")) {
    return `/api/stubs${cleanPath}`;
  }
  return cleanPath ? `/api/stubs/${cleanPath}` : "";
}

function matchesPath(fixture, pathname) {
  if (!fixture.pathPattern) return true;
  return RegExp(fixture.pathPattern).test(pathname);
}

function matchesQueryParameters(fixture, endpointQueryParams) {
  const fixtureQueryKeys = Object.keys(fixture.queryParameterPattern || {});

  const endpointQueryKeys = Object.keys(endpointQueryParams);
  const mergedQueryKeys = new Set([...fixtureQueryKeys, ...endpointQueryKeys]);

  for (const key of mergedQueryKeys) {
    const fixtureQueryValue = (fixture.queryParameterPattern || {})[key];
    const endpointQueryValue = endpointQueryParams[key];

    if (fixtureQueryValue == null && endpointQueryValue == null) continue;
    if (new RegExp(`^${fixtureQueryValue}$`).test(endpointQueryValue)) continue;

    return false;
  }

  return true;
}

function equalToJson(pattern, body) {
  if (!pattern) return true;
  return JSON.stringify(pattern) === JSON.stringify(body);
}

function matchesJsonPathContains(pattern, body) {
  return body.includes(pattern);
}

function matchesJsonPathDoesNotContains(pattern, body) {
  if (!pattern) return true;
  return !body.includes(pattern);
}

function matchesJsonPath(pattern, body) {
  if (typeof pattern === "object") {
    const expression = pattern.expression;
    if (expression) {
      const elements = jsonPath.query(body, expression);
      if (elements.length === 0) return false;

      if (pattern.equalToJson && equalToJson(pattern.equalToJson, elements[0]))
        return true;
      if (
        pattern.contains &&
        matchesJsonPathContains(pattern.contains, elements)
      )
        return true;
      if (
        pattern.doesNotContain &&
        matchesJsonPathDoesNotContains(pattern.doesNotContain, elements)
      )
        return true;

      return false;
    }
    logger.error("missing jsonpath expression", "null", "stubUtil", "null");
    return false;
  }
  const elements = jsonPath.query(body, pattern);
  return elements.length > 0;
}

function matchesBody(fixture, body) {
  if (!fixture.bodyPatterns || fixture.bodyPatterns.length === 0) return true;

  return (fixture.bodyPatterns || []).every((pattern) => {
    const patternKeys = Object.keys(pattern);
    if (patternKeys.length === 0) return true;

    return patternKeys.every((patternKey) => {
      let matches;
      switch (patternKey) {
        case "equalToJson":
          matches = equalToJson(pattern[patternKey], body);
          break;
        case "matchesJsonPath":
          matches = matchesJsonPath(pattern[patternKey], body);
          break;
        default:
          matches = false;
          break;
      }
      return matches;
    });
  });
}

export async function findFixture(fixtures, event) {
  const body =
    event.method === "GET" || event.method === "DELETE"
      ? null
      : await readBody(event);
  return (fixtures || []).find((fixture) => {
    return (
      matchesPath(fixture, getStubsPath(event)) &&
      matchesQueryParameters(fixture, getQuery(event)) &&
      matchesBody(fixture, body)
    );
  });
}

export function isStubsApiRequest(event) {
  const { path } = event;
  return path?.includes("/api/stubs/");
}

export const fixtureRegistry = {
  POST: [
    {
      pathPattern: "^/api/stubs/loans/eligibility$",
      fixturePath: "loans-eligibility.json",
    },
    {
      pathPattern: "^/api/stubs/loans/calculate-rate$",
      fixturePath: "loans-calculate-rate.json",
    },
  ],
  GET: [
    {
      pathPattern: "^/api/stubs/loans/products$",
      fixturePath: "loans-products.json",
    },
    {
      pathPattern: "^/api/stubs/loans/validation-rules$",
      fixturePath: "loans-validation-rules.json",
    },
    {
      pathPattern: "^/api/stubs/loans/eligibilityResult$",
      fixturePath: "response-loans-eligibility.json",
    },
    {
      pathPattern: "^/api/stubs/loans/calculate-rate$",
      fixturePath: "response-calculate-rate.json",
    },
  ],
  PUT: [],
  DELETE: [],
  PATCH: [],
  HEAD: [],
  CONNECT: [],
  OPTIONS: [],
  TRACE: [],
};
