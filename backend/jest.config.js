module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'controllers/**/*.js',
    'routes/**/*.js',
    'models/**/*.js',
    'middleware/**/*.js',
  ],
  coverageThreshold: {
    global: { lines: 60, functions: 60 },
  },
}
