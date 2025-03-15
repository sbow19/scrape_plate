/**
 * Setup for creating mock global chrome object
 */

export function setupMockChromeAPI() {
  global.chrome = {
    runtime: {
      sendMessage: jest.fn((message, responseCallback) =>
        Promise.resolve({ data: {} })
      ),
    },
  };
}

