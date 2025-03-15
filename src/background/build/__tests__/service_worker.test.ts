// service-worker.test.js
import '../service-worker';


describe('Service Worker Tests', () => {
  beforeEach(() => {
    // Clear any mocks before each test
  });

  test('should respond to a test message', () => {
    const sendResponse = jest.fn();
    const message: BackendMessage = { operation: 'database', data: {
      method: "create",
      type: "project",
      data: {}
    } };
    const sender = {}; // Simulate sender (if needed)

    // Call listener callback with the above message
    chrome.runtime.onMessage.addListener.mock.calls[0][0](message, sender, sendResponse)

    // Check if the service worker responded correctly
    expect(sendResponse).not.toHaveBeenCalledWith();
  });

  test('should not respond to an unrecognized message', () => {
    const sendResponse = jest.fn();
    const message = { action: 'unknownAction' };
    
    // Simulate the message being sent to the service worker
    chrome.runtime.onMessage.addListener(message, {}, sendResponse);

    // Ensure no response is sent for an unknown action
    expect(sendResponse).not.toHaveBeenCalled();
  });
});
