module.exports = {
  clearMocks: true,
  collectCoverageFrom: ["src/**/*.{js,jsx,mjs}"],
  coverageDirectory: "coverage",
  setupFilesAfterEnv: ["<rootDir>src/setupTests.js"],
  moduleFileExtensions: ["js", "jsx", "json"],
  transformIgnorePatterns: ["node_modules"],
  testEnvironment: "jsdom",
  testMatch: ["**/__tests__/**/*.js?(x)", "**/?(*.)+(spec|test).js?(x)"],
  testPathIgnorePatterns: ["\\\\node_modules\\\\"],
  testURL: "http://localhost",
  verbose: false
};
