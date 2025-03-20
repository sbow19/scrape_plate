/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/db/db.ts":
/*!**********************!*\
  !*** ./src/db/db.ts ***!
  \**********************/
/***/ (() => {

eval("throw new Error(\"Module parse failed: Unexpected token (205:45)\\nFile was processed with these loaders:\\n * ./node_modules/ts-loader/index.js\\nYou may need an additional loader to handle the result of these loaders.\\n|                             const result = ev.target;\\n|                             const schemasArray = result.result;\\n>                             const schemaStore;\\n|                             for (let schema of schemasArray) {\\n|                                 schemaStore[schema.id] = schema;\");\n\n//# sourceURL=webpack://background/./src/db/db.ts?");

/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _db_db__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./db/db */ \"./src/db/db.ts\");\n/* harmony import */ var _db_db__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_db_db__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/utils */ \"./src/utils/utils.ts\");\n/**\n * Entry point to service worker script\n *\n * The service worker acts as the intermediary between content, action, and side_panel\n * environments, and the browser db (IndexedDB in this case.)\n *\n * Frontend data updates are purely frontend driven - that is any requests for\n * data updates, an deletions, are all determined by the frontend events. The\n * backend simply processes these requests.\n *\n */\n\n\nchrome.runtime.onInstalled.addListener(() => {\n    _db_db__WEBPACK_IMPORTED_MODULE_0___default().openDB()\n        .then((result) => {\n        //  IMPLEMENT: some fallback here\n    })\n        .catch((err) => { });\n});\n/**\n * Handle database operations\n *\n * Step 1): Receive BackendMessage object, providing database  query info in data property\n * Step 2): Database query handled by IndexedDBOperations class, which wraps queries in a promise\n * Step 3): Class will parse the query and determine the correct operation; if successful thenresolves promise, else reject.\n * All everything returns a DBOperationResult\n * Step 4):\n */\nchrome.runtime.onMessage.addListener((message, sender, sendResponse) => {\n    if (message.operation === \"database\") {\n        _db_db__WEBPACK_IMPORTED_MODULE_0___default().handleQuery(message.data)\n            .then((dbResult) => {\n            const backendResponse = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.backendResponseFactory)(message, dbResult);\n            sendResponse(backendResponse);\n        })\n            .catch((dbResult) => {\n            const backendResponse = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.backendResponseFactory)(message, dbResult);\n            sendResponse(backendResponse);\n        });\n    }\n    // Must return true as database queries are asynchronous\n    return true;\n});\n/**\n *  Listen to change tab events to determine whether url matches a\n *  url patterns in user schemas\n */\nchrome.tabs.onActivated.addListener(() => {\n    let currentTab = null;\n    // Get tab information\n    (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.getCurrentTab)()\n        .then((currentTab) => {\n        if (!currentTab)\n            return;\n        currentTab = currentTab;\n        // Get schemas\n        return _db_db__WEBPACK_IMPORTED_MODULE_0___default().handleQuery({\n            method: \"read\",\n            type: \"schema\",\n        });\n    })\n        .then((dbResult) => {\n        if (!dbResult?.success || !currentTab)\n            return;\n        const schemaResult = dbResult.data;\n        const matchingSchemas = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.getMatchingSchemas)(schemaResult, currentTab.url);\n        if (matchingSchemas.length === 0) {\n            chrome.action.setBadgeText({\n                tabId: currentTab.id,\n                text: \"\",\n            });\n            chrome.action.setBadgeBackgroundColor({\n                tabId: currentTab.id,\n                color: \"\",\n            });\n        }\n        // Trigger action animation if to alert user if there is a matching schema\n        chrome.action.setBadgeText({\n            tabId: currentTab.id,\n            text: \"Match\",\n        });\n        chrome.action.setBadgeBackgroundColor({\n            tabId: currentTab.id,\n            color: \"#0F0\",\n        });\n        // Set Context menus for Captureview/edit for this tab\n        // ASSUMPTION: context menu callback will outlast the\n        // lifetime of the background script.\n        // ASSUMPTION: The callback will run such that the sidepanel code is\n        // able to actually catch the message signal\n        chrome.contextMenus.create({\n            title: \"View/edit schema\",\n            contexts: [\"page\"],\n            id: \"view_edit_schema\",\n            onclick: (info, tab) => {\n                chrome.sidePanel.open({\n                    tabId: currentTab.id,\n                }, () => {\n                    // Callback should run to sned data for screen\n                    const sidePanelMessage = {\n                        operation: \"openSidePanel\",\n                        data: {\n                            method: \"view_edit\",\n                            schema: matchingSchemas,\n                        },\n                    };\n                    chrome.runtime.sendMessage(sidePanelMessage);\n                });\n            },\n        });\n        chrome.contextMenus.create({\n            title: \"Capture page\",\n            contexts: [\"page\"],\n            id: \"capture_page\",\n            onclick: (info, tab) => {\n                chrome.sidePanel.open({\n                    tabId: currentTab.id,\n                }, () => {\n                    // Callback should run to sned data for screen\n                    const sidePanelMessage = {\n                        operation: \"openSidePanel\",\n                        data: {\n                            method: \"capture_body\",\n                            schema: matchingSchemas,\n                        },\n                    };\n                    chrome.runtime.sendMessage(sidePanelMessage);\n                });\n            },\n        });\n        // Save matching schemas in database\n        return _db_db__WEBPACK_IMPORTED_MODULE_0___default().handleQuery({\n            method: \"update\",\n            type: \"schemaMatches\",\n            data: matchingSchemas,\n        });\n    })\n        .catch((error) => {\n        console.log(error);\n    });\n});\n// If url changes on active tab\nchrome.tabs.onUpdated.addListener((tabId) => {\n    let currentTab = null;\n    // Get tab information\n    (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.getCurrentTab)()\n        .then((currentTab) => {\n        if (!currentTab)\n            return;\n        currentTab = currentTab;\n        // If changed tab is not current tab then return\n        if (currentTab.id !== tabId)\n            return;\n        // Get schemas\n        return _db_db__WEBPACK_IMPORTED_MODULE_0___default().handleQuery({\n            method: \"read\",\n            type: \"schema\",\n        });\n    })\n        .then((dbResult) => {\n        if (!dbResult?.success || !currentTab)\n            return;\n        const schemaResult = dbResult.data;\n        const matchingSchemas = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.getMatchingSchemas)(schemaResult, currentTab.url);\n        if (matchingSchemas.length === 0) {\n            chrome.action.setBadgeText({\n                tabId: currentTab.id,\n                text: \"\",\n            });\n            chrome.action.setBadgeBackgroundColor({\n                tabId: currentTab.id,\n                color: \"\",\n            });\n        }\n        // Trigger action animation if to alert user if there is a matching schema\n        chrome.action.setBadgeText({\n            tabId: currentTab.id,\n            text: \"Match\",\n        });\n        chrome.action.setBadgeBackgroundColor({\n            tabId: currentTab.id,\n            color: \"#0F0\",\n        });\n        // Save in matches store in IndexedDB\n        return _db_db__WEBPACK_IMPORTED_MODULE_0___default().handleQuery({\n            method: \"update\",\n            type: \"schemaMatches\",\n            data: matchingSchemas,\n        });\n    })\n        .catch((error) => {\n        console.log(error);\n    });\n});\n// CONTEXT MENUS\n/**\n * Context menus will be used to trigger the following events\n * 1) Create schema:  available across all pages\n * 2) View/edit schema: available only on pages with matching url patterns\n * 3) Capture page body: available only on pages with matching url patterns\n *\n * Therefore, there are two types of instances when we need to enable context menus:\n * statically on all pages when tab a activated, and;\n * programmatically when a url matches a url_match string of a users schema.\n *\n * We handle the programmatic creation of context menus within the callbakcs\n * for the onActivated and onUpdated tab events, as they already handle\n * matching logic for urls.\n */\nchrome.tabs.onActivated.addListener(() => {\n    chrome.contextMenus.create({\n        title: \"Create schema\",\n        contexts: [\"page\"],\n        id: \"create_schema\",\n        onclick: (info, tab) => {\n            // Open the side panel, then send a message to the extension\n            // to indicate the reason for opening the side panel\n            chrome.sidePanel\n                .open({\n                tabId: tab.id,\n            }, () => {\n                // Callback should run to sned data for screen\n                const sidePanelMessage = {\n                    operation: \"openSidePanel\",\n                    data: {\n                        method: \"create\",\n                        schema: {\n                            name: \"\",\n                            id: \"\",\n                            url_match: tab.url,\n                            schema: {}\n                        },\n                    },\n                };\n                chrome.runtime.sendMessage(sidePanelMessage);\n            })\n                .then(() => { })\n                .catch((error) => { });\n        },\n    });\n});\n// SIDE PANEL TRIGGERS FROM POPUP\n/**\n * The side panel can also be triggered by the user firing an event\n * from the action\n */\nchrome.runtime.onMessage.addListener((message, sender, senderResponse) => {\n    if (message.operation === \"openSidePanel\") {\n        // Open the side panel, then send a message to the extension\n        // to indicate the reason for opening the side panel\n        chrome.sidePanel\n            .open({\n            tabId: tab.id,\n        }, () => {\n            // Callback should run to sned data for screen\n            const sidePanelMessage = {\n                operation: \"openSidePanel\",\n                data: {\n                    method: message.data.method,\n                    schema: message.data.schema,\n                },\n            };\n            chrome.runtime.sendMessage(sidePanelMessage);\n        });\n    }\n});\n// KEY EVENT TRIGGERS\n\n\n//# sourceURL=webpack://background/./src/main.ts?");

/***/ }),

/***/ "./src/utils/utils.ts":
/*!****************************!*\
  !*** ./src/utils/utils.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   backendResponseFactory: () => (/* binding */ backendResponseFactory),\n/* harmony export */   getCurrentTab: () => (/* binding */ getCurrentTab),\n/* harmony export */   getMatchingSchemas: () => (/* binding */ getMatchingSchemas)\n/* harmony export */ });\n/**\n * Helper functions\n */\nfunction backendResponseFactory(message, data) {\n    // IMPLEMENT: parse message\n    const responseBody = {};\n    if (message.operation === \"database\") {\n        responseBody.operation = \"database\";\n        const databaseResult = data;\n        responseBody.data = {\n            type: databaseResult.type,\n            method: databaseResult.method,\n            success: databaseResult.success,\n            payload: databaseResult?.data ?? null,\n            message: databaseResult.message,\n        };\n    }\n    return responseBody;\n}\nfunction getCurrentTab() {\n    return new Promise(async (resolve) => {\n        const queryOptions = {\n            active: true,\n        };\n        // `tab` will either be a `tabs.Tab` instance or `undefined`.\n        chrome.tabs.query(queryOptions).then(([tab]) => {\n            resolve(tab);\n        });\n    });\n}\nfunction getMatchingSchemas(schemaObject, urlToMatch) {\n    const schemasList = Object.values(schemaObject);\n    if (schemasList.length === 0)\n        return [];\n    if (!urlToMatch)\n        return [];\n    let matchingSchemas = [];\n    // Check whether url matches any schema urls\n    for (let schema of schemasList) {\n        if (urlToMatch.includes(schema.url_match))\n            matchingSchemas.push(schema);\n    }\n    return matchingSchemas;\n}\n\n\n//# sourceURL=webpack://background/./src/utils/utils.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main.ts");
/******/ 	
/******/ })()
;