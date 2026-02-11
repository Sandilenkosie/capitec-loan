import * as jsonPath from "jsonpath";
import { getQuery, readBody } from "h3";
import logger from "./logger.js";

/**
 * Normalize an incoming request event path to the corresponding stubs API path.
 * 
 * @param {Object} event - Request event; expected to contain `path` or `node.req.url`.
 * @returns {string} The normalized stubs path with any query string removed. If the cleaned path already contains `/api/stubs/` it is returned unchanged; otherwise the path is prefixed with `/api/stubs` (or `/api/stubs/`) as needed. Returns an empty string if the event contains no path.
 */
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

/**
 * Checks whether a request pathname matches a fixture's pathPattern.
 * @param {Object} fixture - Fixture object which may contain a `pathPattern` string (a RegExp pattern).
 * @param {string} pathname - The request pathname to test.
 * @returns {boolean} `true` if the pathname matches the fixture's `pathPattern` or if no pattern is specified, `false` otherwise.
 */
function matchesPath(fixture, pathname) {
  if (!fixture.pathPattern) return true;
  return RegExp(fixture.pathPattern).test(pathname);
}

/**
 * Determines whether an endpoint's query parameters satisfy a fixture's query-parameter patterns.
 * @param {Object} fixture - Fixture object that may contain `queryParameterPattern`, an object mapping parameter names to regex-like patterns (strings).
 * @param {Object<string,string>} endpointQueryParams - The actual query parameters from the endpoint, keyed by parameter name.
 * @returns {boolean} `true` if every parameter key in the union of the fixture patterns and endpoint query parameters either is absent on both sides or the endpoint value matches the fixture pattern using a full-match regular expression; `false` otherwise.
 */
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

/**
 * Determines if the JSON serialization of the provided pattern and body are identical.
 * @param {*} pattern - Expected JSON-compatible value; if falsy (e.g., `null` or `undefined`), the function treats it as unspecified and returns `true`.
 * @param {*} body - Actual JSON-compatible value to compare against the pattern.
 * @returns {boolean} `true` if no pattern is provided or if `JSON.stringify(pattern)` equals `JSON.stringify(body)`, `false` otherwise.
 */
function equalToJson(pattern, body) {
  if (!pattern) return true;
  return JSON.stringify(pattern) === JSON.stringify(body);
}

/**
 * Determines whether the provided body contains the given pattern string.
 * @param {string} pattern - The substring to search for.
 * @param {string} body - The text to search within.
 * @returns {boolean} `true` if `body` contains `pattern`, `false` otherwise.
 */
function matchesJsonPathContains(pattern, body) {
  return body.includes(pattern);
}

/**
 * Determines whether the given pattern is not present in the response body.
 * @param {string|undefined|null} pattern - The substring or token to search for; if falsy, the function treats it as absent and returns `true`.
 * @param {string} body - The response body text to search within.
 * @returns {boolean} `true` if `body` does not contain `pattern`, `false` otherwise.
 */
function matchesJsonPathDoesNotContains(pattern, body) {
  if (!pattern) return true;
  return !body.includes(pattern);
}

/**
 * Evaluates whether a JSON body matches a JSONPath-based pattern.
 *
 * If `pattern` is an object, its `expression` (a JSONPath) is executed against `body`.
 * The object may include one of the optional checks:
 * - `equalToJson`: succeeds if the first matched element equals the provided JSON.
 * - `contains`: succeeds if the matched elements contain the provided value.
 * - `doesNotContain`: succeeds if the matched elements do not contain the provided value.
 * If the object has no `expression` or none of the checks succeed, the function returns `false`.
 * If `pattern` is a string, it is treated as a JSONPath expression and the function returns `true` when at least one element matches.
 *
 * @param {Object|string} pattern - A JSONPath expression string or an object with `expression` and optional check keys (`equalToJson`, `contains`, `doesNotContain`).
 * @param {*} body - The JSON value to query against.
 * @returns {boolean} `true` if the body matches the given pattern, `false` otherwise.
 */
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

/**
 * Determines whether a request body satisfies all bodyPatterns defined on a fixture.
 *
 * Evaluates each pattern in `fixture.bodyPatterns`; a pattern with no keys passes.
 * Supported pattern keys: `equalToJson` (compares JSON equality) and `matchesJsonPath` (evaluates a JSONPath-based condition).
 *
 * @param {Object} fixture - Fixture descriptor that may include `bodyPatterns` (array of pattern objects).
 * @param {*} body - The request body to test against the patterns.
 * @returns {boolean} `true` if the fixture has no bodyPatterns or every pattern matches the body, `false` otherwise.
 */
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

/**
 * Locate the first fixture that matches the incoming request's path, query parameters, and body.
 *
 * For non-GET/DELETE requests the request body is read and used when evaluating body patterns.
 *
 * @param {Array<Object>} fixtures - Array of fixture descriptors to search (each may include pathPattern, queryParameterPattern, bodyPatterns, fixturePath, etc.).
 * @param {import('h3').H3Event} event - The incoming request event used to derive path, method, query parameters, and (when applicable) body.
 * @returns {Object|undefined} The first matching fixture object, or `undefined` if no fixture matches.
 */
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

/**
 * Detects whether the incoming event targets the stubs API endpoint.
 * @param {object} event - The request event object; expects a `path` property (string).
 * @returns {boolean} `true` if the event's `path` contains "/api/stubs/", `false` otherwise.
 */
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