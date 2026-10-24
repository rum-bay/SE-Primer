const { defineConfig } = require("cypress");

module.exports = defineConfig({
  video: false,
  e2e: {
    baseUrl: "http://127.0.0.1:4173",
    specPattern: "cypress/e2e/**/*.cy.js",
    supportFile: false,
    viewportWidth: 390,
    viewportHeight: 844
  }
});
