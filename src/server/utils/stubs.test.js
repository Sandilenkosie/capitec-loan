import { describe, expect, it } from "vitest";

import { fixtureRegistry } from "./stubs";

describe("fixture registry", () => {
  it("includes loan products fixture", () => {
    const entry = fixtureRegistry.GET.find((fixture) =>
      /loans\/products/.test(fixture.pathPattern),
    );
    expect(entry).toBeDefined();
    expect(entry?.fixturePath).toBe("loans-products.json");
  });

  it("includes eligibility fixture", () => {
    const entry = fixtureRegistry.POST.find((fixture) =>
      /loans\/eligibility/.test(fixture.pathPattern),
    );
    expect(entry).toBeDefined();
    expect(entry?.fixturePath).toBe("loans-eligibility.json");
  });

  it("includes calculate rate response fixture", () => {
    const entry = fixtureRegistry.GET.find((fixture) =>
      /loans\/calculate-rate/.test(fixture.pathPattern),
    );
    expect(entry).toBeDefined();
    expect(entry?.fixturePath).toBe("response-calculate-rate.json");
  });
});
