export default {
  preset: "ts-jest",
  testEnvironment: "jest-fixed-jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/tests/jest.setup.ts"],
  moduleNameMapper: { "^uuid$": "uuid" },
};
