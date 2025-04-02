/**
 * Script to be injected into teh DOM programmatically.
 *
 * Is triggered when user triggers the scrape command in the
 * action popup. Also triggered when opening the side panel,
 *
 * e.g. when editing or creating a schema, or modifying a capture
 * body when taken.
 *
 *
 * According to mozilla, content scripts which are ran on request, such as by programmatic
 * injection, do not persist. This might be why I kee running into the no receviing end error
 * when trying to establish a connection. Therefore I should inject the base content script
 * to keep track of the connection, data being passed from the extension. Any changes to the
 * presentation can be  triggered by the connection
 *
 */

import { messageFactory } from "../../shared/src/utils/helpers";

{
  // BLOCK USED TO AVOID SETTING GLOBAL VARIABLES
  function resetHighlightedText() {
    const elements = document.getElementsByClassName("scrape_plate_hover");

    for (let el of elements) {
      el.style.backgroundColor = "transparent";
    }
    return;
  }

  function highlightText({ clientX, clientY }) {
    const element = document.elementFromPoint(clientX, clientY);
    if (element === null) return false;
    const nodes = element.childNodes;

    // Loop through nodes at specified point
    for (let node of nodes) {
      // Cancel if already hovering over a highlighted node
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.classList.contains("scrape_plate_hover")) {
          if (node.style.backgroundColor !== "yellow") {
            node.style.backgroundColor = "yellow";
          }
          return;
        } else {
          resetHighlightedText(node);
          return;
        }
      }

      // Loop through all child nodes until a text node is found
      else if (node.nodeType === 3) {
        // Empty range, used to define a portion of a document, text, and modify elements
        const range = document.createRange();

        // Set range to contain the sleected node
        range.selectNode(node);

        // In some instances multiline inline elements like text  boxes use multiple bounding boxes
        // Loop through each bounding rect to return the
        const rects = range.getClientRects();
        for (let rect of rects) {
          // Does pointer fall within the text node bounding rect
          if (
            clientX > rect.left &&
            clientX < rect.right &&
            clientY > rect.top &&
            clientY < rect.bottom
          ) {
            // Apply the span to the DOM
            let parent = node.parentNode;

            if (parent?.nodeType === Node.ELEMENT_NODE) {
              if (parent.classList.contains("scrape_plate_hover")) return;
            }

            const clonedNode = node.cloneNode(false);

            // Wrap the text node in a new span
            let span = document.createElement("span");
            span.className = "scrape_plate_hover";
            span.appendChild(clonedNode);

            // Apply a highlight style (e.g., background color)
            span.style.backgroundColor = "yellow";

            parent.replaceChild(span, node);
          }
        }
      }
    }
  }

  /**
   * Starting at parent of the span node, crawl through five teps of parent
   * elements to build specific css selector. Up to 5 layers of parent nodes
   * above the span element.
   * @param {HTMLSpanElement} spanNode Span Element containing selected text node
   * @returns {DOMDataPoint} css selector or id and the value of such
   */
  function buildCSSSelector(spanNode: HTMLSpanElement) {
    let cssSelector = "";
    let parent: HTMLElement;
    let child = spanNode;

    let i = 0;
    while (i < 5) {
      parent = child.parentElement;

      if (!parent) break;

      let selectorString = "";
      let buffer = "";

      selectorString += parent.tagName.toLowerCase();
      if (parent.id && i === 0) {
        const element = document.getElementById(parent.id);
        const dataPoint: DOMDataPoint = {
          matchType: "id",
          matchExpression: parent.id,
          matchValue: element?.textContent ?? "",
        };
        return dataPoint;
      }

      if (parent.id) {
        selectorString += `#${parent.id}`;
      } else if (parent.classList.length > 0) {
        for (let className of parent.classList) {
          selectorString += `.${className}`;
        }
      }

      buffer = selectorString + (cssSelector ? " > " + cssSelector : "");
      cssSelector = buffer;

      child = parent;
      i++;
    }

    // Fetch text again
    const element = document.querySelector(cssSelector);
    const dataPoint: DOMDataPoint = {
      matchType: "css selector",
      matchExpression: cssSelector,
      matchValue: element?.textContent ?? "",
    };
    return dataPoint;
  }

  function parseClick(e: MouseEvent) {
    e.preventDefault();

    const element = document.elementFromPoint(e.clientX, e.clientY);
    if (element === null) return false;
    const nodes = element.childNodes;

    for (let node of nodes) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.classList.contains("scrape_plate_hover")) {
          const spanContainer = node.parentNode;
          const dataPoint = buildCSSSelector(spanContainer);
          const backendMessage = messageFactory("sendDOMData", {
            type: "fetchOne",
            data: dataPoint,
          });
          extensionPort.postMessage(backendMessage);
          return;
        }
      } else if (node.nodeType === Node.TEXT_NODE) {
        const parent = node.parentNode;

        if (parent?.nodeType === Node.ELEMENT_NODE) {
          if (parent.classList.contains("scrape_plate_hover")) {
            const spanContainer = parent.parentNode;
            const dataPoint = buildCSSSelector(spanContainer);
            const backendMessage = messageFactory("sendDOMData", {
              type: "fetchOne",
              data: dataPoint,
            });
            extensionPort.postMessage(backendMessage);
            return;
          }
        }
      }
    }
  }

  // Declare long lived connection
  let extensionPort: chrome.runtime.Port;
  chrome.runtime.onConnect.addListener((port) => {
    extensionPort = port;
    /* When side panel connects */
    overlay.style.backgroundColor = "rgba(0,0,0,0.25)";

    // Add listener to pointer  location
    document.addEventListener("mousemove", highlightText);
    document.addEventListener("click", parseClick);

    extensionPort.onDisconnect.addListener((ev) => {
      overlay.style.backgroundColor = "rgba(0,0,0,0)";
      document.removeEventListener("mousemove", highlightText);
      document.removeEventListener("mousemove", parseClick);
    });

    extensionPort.onMessage.addListener((message: BackendMessage) => {
      if (message.operation === "sendDOMData") {
        if (message.data.type === "fetchMany") {
          // Extract schemaModel from message
          const schema: SchemaModel = message.data.data.schema;

          // Loop through values and fetch
          Object.values(schema).forEach((entry: SchemaEntry) => {
            const valueEntry = schema[entry.id].value;

            if (!valueEntry.match_expression) return;

            if (valueEntry.match_type === "id") {
              const element = document.getElementById(
                valueEntry.match_expression
              );
              schema[entry.id].value.matched_value =
                element?.textContent?.trim() ?? "";
            } else if (valueEntry.match_type === "css selector") {
              const elements = document.querySelectorAll(
                valueEntry.match_expression
              );
              schema[entry.id].value.matched_value = "";

              elements.forEach((element) => {
                schema[entry.id].value.matched_value +=
                  element?.textContent?.trim() ?? "";
              });
            }
          });

          const backendMessage: BackendMessage = messageFactory("sendDOMData", {
            data: schema,
            type: "fetchMany",
          });
          extensionPort.postMessage(backendMessage);
        } else if (message.data.type === "fetchOne") {
          // Extract domdaatapoint from message
          const domDataPoint: DOMDataPoint = message.data.data;
          if (domDataPoint.matchType === "id") {
            const element = document.getElementById(
              domDataPoint.matchExpression
            );
            domDataPoint.matchValue = element?.textContent?.trim() ?? "";
          } else if (domDataPoint.matchType === "css selector") {
            const elements = document.querySelectorAll(
              domDataPoint.matchExpression
            );
            domDataPoint.matchValue = "";

            elements.forEach((element) => {
              domDataPoint.matchValue += element?.textContent?.trim() ?? "";
            });
          }
          const backendMessage: BackendMessage = messageFactory("sendDOMData", {
            data: domDataPoint,
            type: "fetchOne",
          });
          extensionPort.postMessage(backendMessage);
        }
      }
    });
  });

  // Inject overlay
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.backgroundColor = "rgba(0,0,0,0)";
  overlay.style.pointerEvents = "none";
  overlay.style.zIndex = "10000";
  overlay.style.top = "0";
  overlay.style.left = "0";

  overlay.id = "scrape_plate_overlay";

  document.body.appendChild(overlay);
}
