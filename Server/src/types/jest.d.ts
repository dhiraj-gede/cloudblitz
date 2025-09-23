// Global type declarations for Jest test environment
/// <reference types="jest" />

declare global {
  const describe: jest.Describe;
  const test: jest.It;
  const it: jest.It;
  const expect: jest.Expect;
  const beforeAll: jest.Lifecycle;
  const beforeEach: jest.Lifecycle;
  const afterAll: jest.Lifecycle;
  const afterEach: jest.Lifecycle;
}

export {};