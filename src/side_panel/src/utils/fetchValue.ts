import { messageFactory } from "../../../shared/src/utils/helpers";

/**
 * Generic helper function to fetch matching elements from the DOM
 * @param value
 * @param matchType
 * @returns
 */
export const fetchValue = (
  matchExpression: string,
  matchType: "id" | "css selector" | "regex",
  port: chrome.runtime.Port
): Promise<DOMDataPoint> => {
  return new Promise((resolve, reject) => {
    const backendMessage = messageFactory("sendDOMData", {
      type: "fetchOne",
      data: {
        matchType,
        matchExpression,
        matchValue: "",
      },
    });
    // Listen to port for responses
    port.onMessage.addListener((message: BackendMessage) => {
      if (message.operation === "sendDOMData") {
        if (message.data.type === "fetchOne") {
          resolve(message.data.data);
        }
      }
    });

    // Wait for response from frontend
    port.postMessage(backendMessage);

    // Abort  Promise
    setTimeout(() => {
      reject("Search took too long");
    }, 2000);
  });
};