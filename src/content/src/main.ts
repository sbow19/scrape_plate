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

  function replaceSpanWithChildText(span: HTMLSpanElement) {
    if (!span) return;
    // Get the first child node (which is the text node) of the highlighted span
    const childTextNode = span?.firstChild?.cloneNode();

    // Get the parent element of the highlighted node (which is the <span>)
    const spanParent = span?.parentElement;

    // If the span has a parent and the text node was successfully cloned
    if (childTextNode && spanParent) {
      // Now remove the span element itself
      spanParent.replaceChild(childTextNode, span);
    }

    highlightedNode = null;
  }

  function replaceChildTextWithSpan(textNode: Node) {
    // Get the parent element of span
    const textNodeParent = textNode.parentElement;

    // Create new span and set in cloned text node
    // Wrap the text node in a new span
    let span = document.createElement("span");
    span.className = "scrape_plate_hover";
    span.style.backgroundColor = "yellow";
    const clonedNode = textNode.cloneNode(false);
    span.appendChild(clonedNode);

    // Insert the cloned text node back into the same position as the span
    textNodeParent?.replaceChild(span, textNode);

    // Set highlighted node
    highlightedNode = span;
  }

  function filterParentChildren(parentChildrenArray: Array<ChildNode>) {
    return parentChildrenArray.filter((child) => {
      // Check for HTML comment
      if (child.nodeType === 8) {
        return false
      }
      // Check for <hr> tag
      else if ((child?.tagName ?? "") === "HR") {
        return false
      }
      // Check for <br> tag
      else if ((child?.tagName ?? "") === "BR") {
        return false
      }
      return true
    });
  }

  function getChildNodeByPosition(
    parent: HTMLElement,
    childPositionIndex: number
  ) {
    // Get all child nodes of the parent, including text nodes
    const parentChildren = Array.from(parent.childNodes);
    const filteredChildren = filterParentChildren(parentChildren);
    return filteredChildren[childPositionIndex];
  }

  function parseMatchString(matchExpression: string): [string, number] {
    let cssSelector = matchExpression;
    // Find the position of the last matching (the start of "child:")
    const matchIndexChild = cssSelector.lastIndexOf("child:");

    // Extract the substring starting from "child:" onwards
    const childSubstringNumberStr = cssSelector.slice(matchIndexChild + 6);
    cssSelector = cssSelector.slice(0, matchIndexChild);
    const childIndex = Number(childSubstringNumberStr);

    return [cssSelector, childIndex];
  }

  /**
   * Custom selector contains child node number encoded in string
   * @param cssSelector
   */
  function getElementFromCustomSelector(cssSelector) {
    // Split string by ; seperator. First el in array will be topmost element
    const selectorArray = cssSelector.split(";");

    let currentParent = document.querySelector("html");

    // Loop through array and select element from previous search
    for (let i = 0; i < selectorArray.length; i++) {
      if (!currentParent || typeof currentParent === "string") return currentParent;
      let [, childIndex] = parseMatchString(selectorArray[i]);
      currentParent = getChildNodeByPosition(currentParent, childIndex);

    }

    // Current parent should be final text node
    return currentParent;
  }

  // Reference to highlighted node. Span wraps the targeted text node
  let highlightedNode: HTMLSpanElement | null = null;
  /**
   * Hovering over text node wil wrap it in a span and highlight the span in yellow.
   *
   * @param param0
   * @returns
   */
  function highlightText({ clientX, clientY }) {
    /**
     * Returns topmost element relative to viewport
     */
    const element = document.elementFromPoint(clientX, clientY);
    if (element === null) return false;
    if (element === highlightedNode) return;
    const nodes = element.childNodes;

    // Loop through nodes at specified point
    for (let node of nodes) {
      // Cancel if already hovering over a highlighted node
      if (node === highlightedNode) {
        return;
      }

      // Loop through all child nodes until a text node is found
      if (node.nodeType === 3) {
        // Empty range, used to define a portion of a document, text, and modify elements
        const range = document.createRange();

        // Set range to contain the sleected node
        range.selectNode(node);

        // In some instances multiline inline elements like text  boxes use multiple bounding boxes
        // Loop through each bounding rect to return the
        const rects = range.getClientRects();

        /**
         * Check to see whether text node actually falls under the cursor.
         * Some text nodes may be inadvertantly  picked up if we cycle
         * through all children.
         */
        for (let rect of rects) {
          // Does pointer fall within the text node bounding rect
          if (
            clientX > rect.left &&
            clientX < rect.right &&
            clientY > rect.top &&
            clientY < rect.bottom
          ) {
            // Replace old node
            replaceSpanWithChildText(highlightedNode);

            // Highlight new node
            replaceChildTextWithSpan(node);

            // No more highlighting necessary
            return;
          }
        }

        // If text not underneath the cursor, we check the next node
      }
    }

    // If no relevant node was found, then cancel cancellation
    replaceSpanWithChildText(highlightedNode);
  }

  /**
   * Starting at parent of the span node, crawl through five teps of parent
   * elements to build specific css selector. Up to 5 layers of parent nodes
   * above the span element.
   *
   * For each, we find the location of a child element in respect of its
   * parent element, and encode that in the css selector string.
   *
   * @param {HTMLSpanElement} spanNode Span Element containing selected text node
   * @returns {DOMDataPoint} css selector or id and the value of such
   */
  function buildCSSSelector(spanNode: HTMLSpanElement): DOMDataPoint {
    // Final css selector with child position encoided
    let cssSelector = "";
    let parent: HTMLElement;
    let child = spanNode;
    // Where current child element sits under parent element
    let childIndex: number;

    let i = 0;
    while (true) {
      // Get parent elemetn
      parent = child.parentElement;

      // Top level, leave loop
      if (!parent) break;

      // Get all the child nodes
      const parentChildren = Array.from(parent.childNodes);

      const filteredChildren = filterParentChildren(parentChildren);

      // Find the index of the highlighted span in the parent's children
      // This index is encoded in the css selector string
      childIndex = filteredChildren.indexOf(child);

      // Add element tag to selector string
      let selectorString = "";
      selectorString += parent.tagName.toLowerCase();

      // If the parent has an id, then this is the sole selector
      if (parent.id && i === 0) {
        // Get parent element with id
        const element = document.getElementById(parent.id);

        // Get element based on span node position
        const span = getChildNodeByPosition(element, childIndex);

        const dataPoint: DOMDataPoint = {
          matchType: "id",
          matchExpression: parent.id,
          matchValue: span?.textContent ?? "",
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

      // Append child location in node array
      selectorString += ` child:${childIndex};`;

      // Append the selector string to the front of the current css selector
      cssSelector = selectorString + (cssSelector ? " > " + cssSelector : "");

      child = parent;
      i++;
    }

    // Fetch text again
    // Get element based on span node position
    const span = getElementFromCustomSelector(cssSelector);
    const dataPoint: DOMDataPoint = {
      matchType: "css selector",
      matchExpression: cssSelector,
      matchValue: span?.textContent ?? "",
    };
    return dataPoint;
  }

  /**
   * Trigger sendDomData event. Highlight the text green as selected.
   * @param e
   * @returns
   */
  function parseClick(e: MouseEvent) {
    e.preventDefault();

    const element = document.elementFromPoint(e.clientX, e.clientY);
    if (element === null) return false;
    if (element === highlightedNode) {
      const dataPoint = buildCSSSelector(highlightedNode);
      const backendMessage = messageFactory("sendDOMData", {
        type: "fetchOne",
        data: dataPoint,
      });
      extensionPort.postMessage(backendMessage);
      return;
    }
    const nodes = element.childNodes;

    for (let node of nodes) {
      if (node === highlightedNode) {
        // Generate CSS selector and data from selector
        const dataPoint = buildCSSSelector(highlightedNode);
        const backendMessage = messageFactory("sendDOMData", {
          type: "fetchOne",
          data: dataPoint,
        });
        extensionPort.postMessage(backendMessage);
        return;
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
              // Get text node from custom selector
              const textNode = getElementFromCustomSelector(
                valueEntry.match_expression
              );

              schema[entry.id].value.matched_value =
                textNode?.textContent?.trim() ?? "";
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
            // Get text node from custom selector
            const textNode = getElementFromCustomSelector(
              domDataPoint.matchExpression
            );

            domDataPoint.matchValue = textNode?.textContent?.trim() ?? "";
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
