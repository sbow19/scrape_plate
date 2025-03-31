/**
 * Entry point to service worker script
 *
 * The service worker acts as the intermediary between content, action, and side_panel
 * environments, and the browser db (IndexedDB in this case.)
 *
 * Frontend data updates are purely frontend driven - that is any requests for
 * data updates, an deletions, are all determined by the frontend events. The
 * backend simply processes these requests.
 *
 */
import IndexedDBOperations from "./db/db";
import {
  backendResponseFactory,
  getCurrentTab,
  getMatchingSchemas,
} from "./utils/utils";

chrome.runtime.onInstalled.addListener(() => {
  IndexedDBOperations.openDB()
    .then((result) => {
      //  IMPLEMENT: some fallback here
    })
    .catch((err: DBOperationResult) => {});
});
/**
 * Handle database operations
 *
 * Step 1): Receive BackendMessage object, providing database  query info in data property
 * Step 2): Database query handled by IndexedDBOperations class, which wraps queries in a promise
 * Step 3): Class will parse the query and determine the correct operation; if successful thenresolves promise, else reject.
 * All everything returns a DBOperationResult
 * Step 4):
 */
chrome.runtime.onMessage.addListener(
  (message: BackendMessage, sender, sendResponse) => {
    if (message.operation === "database") {
      IndexedDBOperations.handleQuery(message.data)
        .then((dbResult) => {
          const backendResponse: BackendResponse = backendResponseFactory(
            message,
            dbResult
          );

          sendResponse(backendResponse);
        })
        .catch((dbResult) => {
          const backendResponse: BackendResponse = backendResponseFactory(
            message,
            dbResult
          );
          sendResponse(backendResponse);
        });
    }
    // Must return true as database queries are asynchronous
    return true;
  }
);

/**
 * Listen for change tab to close the side panel
 */

chrome.tabs.onActivated.addListener(() => {
  /* switch sidepanel off and on */
  chrome.sidePanel.setOptions({ enabled: false });
  chrome.sidePanel.setOptions({ enabled: true });
});

chrome.tabs.onUpdated.addListener(() => {
  /* switch sidepanel off and on */
  chrome.sidePanel.setOptions({ enabled: false });
  chrome.sidePanel.setOptions({ enabled: true });
});
/**
 *  Listen to change tab events to determine whether url matches a
 *  url patterns in user schemas
 */
chrome.tabs.onActivated.addListener(() => {
  let currentTab: chrome.tabs.Tab = null;
  // Get tab information
  getCurrentTab()
    .then((currentTabSearch) => {
      if (!currentTabSearch) return;

      currentTab = currentTabSearch;
      // Get schemas
      return IndexedDBOperations.handleQuery({
        method: "read",
        type: "schema",
      });
    })
    .then((dbResult) => {
      if (!dbResult?.success || !currentTab) return;

      const schemaResult = dbResult.data as {
        [key: string]: Schema;
      };

      const matchingSchemas = getMatchingSchemas(schemaResult, currentTab.url);

      if (matchingSchemas.length === 0) {
        chrome.action.setBadgeText({
          tabId: currentTab.id,
          text: "",
        });
      } else if (matchingSchemas.length > 0) {
        // Trigger action animation if to alert user if there is a matching schema
        chrome.action.setBadgeText({
          tabId: currentTab.id,
          text: "Hit",
        });
        chrome.action.setBadgeBackgroundColor({
          tabId: currentTab.id,
          color: "#0F0",
        });

        // Set Context menus for Captureview/edit for this tab
        // ASSUMPTION: context menu callback will outlast the
        // lifetime of the background script.
        // ASSUMPTION: The callback will run such that the sidepanel code is
        // able to actually catch the message signal

        chrome.contextMenus.create({
          title: "View/edit schema",
          contexts: ["page"],
          id: "edit_schema",
        });

        chrome.contextMenus.create({
          title: "Capture page",
          contexts: ["page"],
          id: "edit_capture",
        });
      }

      // Save matching schemas in database
      return IndexedDBOperations.handleQuery({
        method: "update",
        type: "schemaMatches",
        data: matchingSchemas,
      });
    })
    .catch((error) => {
      console.log(error, "On activated schema checks");
    });
});

// If url changes on active tab
chrome.tabs.onUpdated.addListener((tabId: number) => {
  let currentTab: chrome.tabs.Tab = null;
  // Get tab information
  getCurrentTab()
    .then((currentTabSearch) => {
      console.log(currentTabSearch)
      if (!currentTabSearch) return;
      currentTab = currentTabSearch;

      // If changed tab is not current tab then return
      if (currentTab.id !== tabId) return;

      // Get schemas
      return IndexedDBOperations.handleQuery({
        method: "read",
        type: "schema",
      });
    })
    .then((dbResult) => {
      if (!dbResult?.success || !currentTab) return;

      const schemaResult = dbResult.data as {
        [key: string]: Schema;
      };

      const matchingSchemas = getMatchingSchemas(schemaResult, currentTab.url);


      if (matchingSchemas.length === 0) {
        chrome.action.setBadgeText({
          tabId: currentTab.id,
          text: "",
        });
      } else if (matchingSchemas.length > 0) {
        // Trigger action animation if to alert user if there is a matching schema
        chrome.action.setBadgeText({
          tabId: currentTab.id,
          text: "Hit",
        });
        chrome.action.setBadgeBackgroundColor({
          tabId: currentTab.id,
          color: "#0F0",
        });
      }

      // Save in matches store in IndexedDB
      return IndexedDBOperations.handleQuery({
        method: "update",
        type: "schemaMatches",
        data: matchingSchemas,
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

// CONTEXT MENUS
/**
 * Context menus will be used to trigger the following events
 * 1) Create schema:  available across all pages
 * 2) View/edit schema: available only on pages with matching url patterns
 * 3) Capture page body: available only on pages with matching url patterns
 *
 * Therefore, there are two types of instances when we need to enable context menus:
 * statically on all pages when tab a activated, and;
 * programmatically when a url matches a url_match string of a users schema.
 *
 * We handle the programmatic creation of context menus within the callbakcs
 * for the onActivated and onUpdated tab events, as they already handle
 * matching logic for urls.
 */

chrome.tabs.onActivated.addListener(() => {
  chrome.contextMenus.create({
    title: "Create schema",
    contexts: ["page"],
    id: "create_schema",
  });
});

chrome.contextMenus.onClicked.addListener(
  (clickData: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab) => {
    switch (clickData.menuItemId) {
      case "create_schema":
        {
          chrome.sidePanel.open(
            {
              tabId: tab.id,
            },
            () => {
              // Callback should run to sned data for screen
              const sidePanelMessage: BackendResponse = {
                operation: "openSidePanel",
                data: {
                  method: "create_schema",
                  schema: {
                    name: "",
                    id: "",
                    url_match: tab.url,
                    schema: {},
                  },
                },
              };
              chrome.runtime.sendMessage(sidePanelMessage);
            }
          );
        }
        break;
      case "edit_schema":
        {
          IndexedDBOperations.handleQuery({
            type: "schemaMatches",
            method: "read",
          }).then((dbResult) => {
            chrome.sidePanel.open(
              {
                tabId: tab.id,
              },
              () => {
                // Callback should run to sned data for screen
                const sidePanelMessage: BackendResponse = {
                  operation: "openSidePanel",
                  data: {
                    method: "edit_schema",
                    schema: dbResult.data["schemaMatches"],
                  },
                };
                chrome.runtime.sendMessage(sidePanelMessage);
              }
            );
          });
        }
        break;
      case "capture_body":
        {
          IndexedDBOperations.handleQuery({
            type: "schemaMatches",
            method: "read",
          }).then((dbResult) => {
            chrome.sidePanel.open(
              {
                tabId: tab.id,
              },
              () => {
                // Callback should run to sned data for screen
                const sidePanelMessage: BackendResponse = {
                  operation: "openSidePanel",
                  data: {
                    method: "edit_capture",
                    schema: dbResult.data["schemaMatches"],
                  },
                };
                chrome.runtime.sendMessage(sidePanelMessage);
              }
            );
          });
        }
        break;
    }
  }
);

// SIDE PANEL TRIGGERS FROM POPUP
/**
 * The side panel can also be triggered by the user firing an event
 * from the action
 *
 * sidePanel.open() can only be opened in response to 'user gestures'.
 * According to Mozilla, user gestures follow a no surprises principle,
 * such that this API can only be called in the callback for the user
 * action. Above, the side panel is opened in the callback for context menu
 * click, which is the callback handling the user gesture.
 *
 * Here, the callback handling the sidePnelopen is waiting for the resolution of a
 * promise, getCurrentTab. This means that the user gesture handler loses it' status as such
 *
 * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/User_actions
 * https://stackoverflow.com/questions/27669590/chrome-extension-function-must-be-called-during-a-user-gesture
 *
 * I presume as well that sending a message via the backend is not a user gesture. We
 * will need to migrate the sidePanel opening logic to the action. Therefore, we also
 * need to have handy the tab information.
 *
 * useContext --> set Tab information every time popup is created -->  available syncrhonously to action
 */
chrome.runtime.onMessage.addListener(
  (message: BackendMessage, sender, sendResponse) => {
    if (message.operation === "getCurrentTab") {
      getCurrentTab()
        .then((tab) => {
          const backendResponse = backendResponseFactory(message, tab);

          sendResponse(backendResponse);
        })
        .catch(() => {});
      return true;
    }
  }
);

chrome.commands.onCommand.addListener((command, tab) => {
  switch (command) {
    case "create_schema":
      chrome.sidePanel.open(
        {
          tabId: tab?.id ?? 0,
        },
        () => {
          const backgroundMessage: BackendMessage = {
            operation: "openSidePanel",
            data: {
              method: "create_schema",
              schema: null,
              tab: tab,
            },
          };

          setTimeout(() => {
            chrome.runtime.sendMessage(backgroundMessage);
          }, 100);
        }
      );
      break;
    case "edit_capture":
      chrome.sidePanel.open({
        tabId: tab?.id ?? 0,
      });
      break;
    case "edit_schema":
      chrome.sidePanel.open({
        tabId: tab?.id ?? 0,
      });
      break;
    default:
      break;
  }
});
