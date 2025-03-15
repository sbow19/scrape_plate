/**
 * Entry point to service worker script
 * 
 * The service worker acts as the intermediary between content, action, and side_panel 
 * environments, and the browser db (IndexedDB in this case.)
 * 
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'test') {
      sendResponse({ response: 'Hello from service worker!' });
    }
  });