module.exports = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  testMatch: null,
  testRegex: '/__test__/.*\\.test\\.(js|ts)$',
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/out/'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  clearMocks: true,
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/__test__/tsconfig.json',
      diagnostics: false
    }
  }
};
