module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{ts,tsx,js}"],
  moduleFileExtensions: ["ts", "tsx", "js"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  roots: ["test"],
  testMatch: ["**/?(*.)(spec|test).(j|t)s?(x)"],
  testEnvironment: "node",
  globals: {
    "ts-jest": {
      //tsConfig: "tsconfig.build.json",
      diagnostics: false,
    },
  },
};
