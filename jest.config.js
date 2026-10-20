module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^expo-network$': '<rootDir>/tests/mocks/expo-network.js',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          module: 'NodeNext',
          moduleResolution: 'NodeNext',
          target: 'ES2022',
          esModuleInterop: true,
          allowJs: true,
          resolveJsonModule: true,
          isolatedModules: true,
          jsx: 'react-jsx',
        },
        diagnostics: {
          ignoreCodes: [151002],
        },
      },
    ],
  },
};
