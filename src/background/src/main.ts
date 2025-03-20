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
 *  Listen to change tab events to determine whether url matches a
 *  url patterns in user schemas
 */
chrome.tabs.onActivated.addListener(() => {
  let currentTab: chrome.tabs.Tab = null;
  // Get tab information
  getCurrentTab()
    .then((currentTab) => {
      if (!currentTab) return;
      currentTab = currentTab;
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
        chrome.action.setBadgeBackgroundColor({
          tabId: currentTab.id,
          color: "",
        });
      }

      // Trigger action animation if to alert user if there is a matching schema
      chrome.action.setBadgeText({
        tabId: currentTab.id,
        text: "Match",
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
        id: "view_edit_schema",
      });

      chrome.contextMenus.create({
        title: "Capture page",
        contexts: ["page"],
        id: "capture_page",
      });

      // Save matching schemas in database
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

// If url changes on active tab
chrome.tabs.onUpdated.addListener((tabId: number) => {
  let currentTab: chrome.tabs.Tab = null;
  // Get tab information
  getCurrentTab()
    .then((currentTab) => {
      if (!currentTab) return;
      currentTab = currentTab;

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
        chrome.action.setBadgeBackgroundColor({
          tabId: currentTab.id,
          color: "",
        });
      }

      // Trigger action animation if to alert user if there is a matching schema
      chrome.action.setBadgeText({
        tabId: currentTab.id,
        text: "Match",
      });
      chrome.action.setBadgeBackgroundColor({
        tabId: currentTab.id,
        color: "#0F0",
      });

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

chrome.contextMenus.onClicked.addListener((clickData: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab) => {
  switch (clickData.menuItemId) {
    case "create_schema":
      {
        chrome.sidePanel
        .open(
          {
            tabId: tab.id,
          },
          () => {
            // Callback should run to sned data for screen
            const sidePanelMessage: BackendResponse = {
              operation: "openSidePanel",
              data: {
                method: "create",
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
        )
      }
      break;
    case "view_edit_schema":
      {
        IndexedDBOperations.handleQuery(
          {
            type: "schemaMatches",
            method: "read"
          }
        ).then((dbResult)=>{

          chrome.sidePanel.open(
            {
              tabId: tab.id,
            },
            () => {
              // Callback should run to sned data for screen
              const sidePanelMessage: BackendResponse = {
                operation: "openSidePanel",
                data: {
                  method: "view_edit",
                  schema: dbResult.data["schemaMatches"],
                },
              };
              chrome.runtime.sendMessage(sidePanelMessage);
            }
          );

        })
      }
      break;
    case "capture_body":
      {
        IndexedDBOperations.handleQuery(
          {
            type: "schemaMatches",
            method: "read"
          }
        ).then((dbResult)=>{

          chrome.sidePanel.open(
            {
              tabId: tab.id,
            },
            () => {
              // Callback should run to sned data for screen
              const sidePanelMessage: BackendResponse = {
                operation: "openSidePanel",
                data: {
                  method: "capture_body",
                  schema: dbResult.data["schemaMatches"],
                },
              };
              chrome.runtime.sendMessage(sidePanelMessage);
            }
          );

        })
        
      }
      break;
  }
});

// SIDE PANEL TRIGGERS FROM POPUP
/**
 * The side panel can also be triggered by the user firing an event
 * from the action
 */
chrome.runtime.onMessage.addListener(
  (message: BackendMessage, sender, senderResponse) => {
    if (message.operation === "openSidePanel") {
      // Open the side panel, then send a message to the extension
      // to indicate the reason for opening the side panel
      chrome.sidePanel.open(
        {
          tabId: tab.id,
        },
        () => {
          // Callback should run to sned data for screen
          const sidePanelMessage: BackendResponse = {
            operation: "openSidePanel",
            data: {
              method: message.data.method,
              schema: message.data.schema,
            },
          };
          chrome.runtime.sendMessage(sidePanelMessage);
        }
      );
    }
  }
);

// KEY EVENT TRIGGERS
