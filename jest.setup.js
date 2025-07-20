// Increase timeout for all tests
jest.setTimeout(30000);

// Mock console methods to avoid noise in tests
const originalConsole = console;
global.console = {
  ...console
  // Uncomment to ignore console logs during tests
  // log: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};

// Cleanup after tests
afterAll(() => {
  global.console = originalConsole;
});
