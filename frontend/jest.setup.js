import '@testing-library/jest-dom'

// Mock alert
global.alert = jest.fn();

// Mock console.error to reduce noise
const originalError = console.error;
console.error = (...args) => {
  const message = args.join(" ");
  if (message.includes("Warning:") || message.includes("API Error")) {
    return; // silence it
  }
  originalError.call(console, ...args);
};

// ✅ Mock clipboard API (configurable so user-event can redefine it)
Object.defineProperty(navigator, "clipboard", {
  value: {
    writeText: jest.fn(),
    readText: jest.fn(),
  },
  writable: true,
  configurable: true, // <-- this fixes the "Cannot redefine property" error
});
