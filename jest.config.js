module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.js'],
    collectCoverageFrom: ['src/**/*.js', 'controllers/**/*.js', 'routes/**;*.js'],
    coverageDirectory: 'coverage'
}