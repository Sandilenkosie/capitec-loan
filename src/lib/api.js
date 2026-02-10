const resolveApiBase = () => {
  const useStubs = import.meta.env.VITE_USE_STUBS === "true";
  const platformApi = import.meta.env.VITE_PLATFORM_API;

  if (useStubs) {
    return "/api/stubs";
  }

  if (platformApi) {
    return platformApi;
  }

  if (import.meta.env.MODE === "development") {
    return "/api/stubs";
  }

  return "/api/stubs";
};

const apiBase = resolveApiBase();

const fetchJson = async (path, options = {}) => {
  const response = await fetch(`${apiBase}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }

  const payload = await response.json();
  return payload?.data ?? payload;
};

export const getLoanProducts = () => fetchJson("/loans/products");
export const getLoanEligibility = () => fetchJson("/loans/eligibilityResult");
export const getCalculateRate = () => fetchJson("/loans/calculate-rate");

export const getValidationRules = () => fetchJson("/loans/validation-rules");

export const getEligibilitySample = () =>
  fetchJson("/loans/eligibility", {
    method: "GET",
  });

export const checkEligibility = (payload) =>
  fetchJson("/loans/eligibility", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const calculateRate = (payload) =>
  fetchJson("/loans/calculate-rate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
