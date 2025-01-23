export default {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    testMatch: ['<rootDir>/src/**/__tests__/**/*.{ts,tsx}'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
}; 