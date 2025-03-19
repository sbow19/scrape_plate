/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/db/db.ts":
/*!**********************!*\
  !*** ./src/db/db.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/**\n * Indexed db API\n */\nclass IndexedDBOperations {\n    static openDB() {\n        return new Promise((resolve, reject) => {\n            // Create new IndexedDB store - no version number provided\n            const dbRequest = indexedDB.open(\"scrape_plate\");\n            dbRequest.onupgradeneeded = (ev) => {\n                // Extract db from upgradeneeded event\n                const db = dbRequest.result ?? null;\n                if (!db)\n                    throw new Error(\"DB could not be updated\");\n                // Create object stores for user content model\n                db.createObjectStore(\"details\");\n                db.createObjectStore(\"projects\", {\n                    keyPath: \"id\",\n                });\n                db.createObjectStore(\"schemas\", {\n                    keyPath: \"id\",\n                });\n                resolve(IndexedDBOperations._DBOperationResultFactory(true, \"create\", \"other\", null));\n            };\n            // IMPLEMENT: When db initialized, trigger the action to show in toolbar\n            dbRequest.onsuccess = (ev) => { };\n            // IMPLEMENT: Some fatal error occurred when opening db\n            dbRequest.onerror = (ev) => {\n                /**\n                 * Handle error gracefully -- inform user that some issue occured\n                 */\n                reject(IndexedDBOperations._DBOperationResultFactory(false, \"create\", \"other\", null));\n            };\n        });\n    }\n    static handleQuery(dbQuery) {\n        console.log(dbQuery);\n        return new Promise((resolve, reject) => {\n        });\n    }\n    /**\n     * @param {boolean} success             Was the requested operation successful\n     * @param {DBOperations} method         What was the requested method on the db\n     * @param {DBOperationDataType} type    What was the type of data was the subject of the requests (e.g.  captures)\n     * @param {string | null} message       Was there a response message from the db operation, e.g. error message\n     * @returns {DBOperationResult}\n     */\n    static _DBOperationResultFactory(success, method, type, message = null) {\n        return {\n            success,\n            method,\n            type,\n            message\n        };\n    }\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (IndexedDBOperations);\n\n\n//# sourceURL=webpack://background/./src/db/db.ts?");

/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _db_db__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./db/db */ \"./src/db/db.ts\");\n/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/utils */ \"./src/utils/utils.ts\");\n/**\n * Entry point to service worker script\n *\n * The service worker acts as the intermediary between content, action, and side_panel\n * environments, and the browser db (IndexedDB in this case.)\n *\n */\n\n\nchrome.runtime.onInstalled.addListener(() => {\n    _db_db__WEBPACK_IMPORTED_MODULE_0__[\"default\"].openDB()\n        .then((result) => {\n        //  IMPLEMENT: some fallback here\n    })\n        .catch((err) => { });\n});\n/**\n * Handle database operations\n *\n * Step 1): Receive BackendMessage object, providing database  query info in data property\n * Step 2): Database query handled by IndexedDBOperations class, which wraps queries in a promise\n * Step 3): Class will parse the query and determine the correct operation; if successful thenresolves promise, else reject.\n * All everything returns a DBOperationResult\n * Step 4):\n */\nchrome.runtime.onMessage.addListener((message, sender, sendResponse) => {\n    if (message.operation === \"database\") {\n        console.log(_db_db__WEBPACK_IMPORTED_MODULE_0__[\"default\"].handleQuery());\n        _db_db__WEBPACK_IMPORTED_MODULE_0__[\"default\"].handleQuery(message.data)\n            .then((dbResult) => {\n            const backendResponse = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.backendResponseFactory)(message, dbResult);\n            sendResponse(backendResponse);\n        })\n            .catch((dbResult) => {\n            const backendResponse = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.backendResponseFactory)(message, dbResult);\n            sendResponse(backendResponse);\n        });\n    }\n    //Must return true as database queries are asynchronous\n    return true;\n});\n\n\n//# sourceURL=webpack://background/./src/main.ts?");

/***/ }),

/***/ "./src/utils/utils.ts":
/*!****************************!*\
  !*** ./src/utils/utils.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   backendResponseFactory: () => (/* binding */ backendResponseFactory)\n/* harmony export */ });\n/**\n * Helper functions\n */\nfunction backendResponseFactory(message, data) {\n    // IMPLEMENT: parse message\n    const responseBody = {};\n    if (message.operation === 'database') {\n        responseBody.operation = 'database';\n        const databaseResult = data;\n        responseBody.data = {\n            type: databaseResult.type,\n            method: databaseResult.method,\n            success: databaseResult.success,\n            payload: databaseResult.data,\n            message: databaseResult.message\n        };\n    }\n    return responseBody;\n}\n\n\n//# sourceURL=webpack://background/./src/utils/utils.ts?");

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