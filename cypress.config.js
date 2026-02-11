import { defineConfig } from "cypress";

export default defineConfig({
  video: false,
  retries: {
    runMode: 2,
    openMode: 0, // when running locally, leave no room for errors
  },
  viewportHeight: 900,
  viewportWidth: 1440,
  e2e: {
    setupNodeEvents() {},
    baseUrl: "http://localhost:8080/",
    specPattern: "cypress/e2e/**/*.cy.{js,ts}",
    experimentalOriginDependencies: true,
    experimentalMemoryManagement: true,
    numTestsKeptInMemory: 1,
  },
});
