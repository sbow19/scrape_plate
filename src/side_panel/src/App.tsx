/**
 * Listen to events to open side panel
 */
import { SidePanelTemplate } from "./components/side_panel_template";
import { SchemaFormTemplate } from "./components/schema_form_template";
import { useRef, useState } from "react";
import ExtensionContext from "./context/ExtensionObjects";

export const App = () => {
  // Prevent multiple invocations of chrome listeners being added
  const loadRef = useRef(false);

  // Conditional load
  const [isLoaded, setIsLoaded] = useState(false);

  // Determine which content to show
  const [operationMethod, setOperationMethod] = useState<
    "create_schema" | "edit_schema" | "edit_capture"
  >("create_schema");

  // Which type of Schema Model: Capture or Schema
  const [modelType, setModelType] = useState<"capture" | "schema">("capture");

  // Set model or models. May be sent in open side panel request
  const [model, setModel] = useState<Schema | Capture | Schema[] | null>(null);

  // Set chrome tab details. Useful for url and id data.
  const [currentTab, setTab] = useState<chrome.tabs.Tab | null>(null);

  // Set port for communicating with content script
  const [port, setPort] = useState<chrome.runtime.Port | null>(null);

  if (!loadRef.current) {
    loadRef.current = true;

    chrome.runtime.onMessage.addListener((message: BackendMessage) => {
      if (message.operation === "openSidePanel") {
        const { schema, tab, method } = message.data;

        // Operation determines whether to use capture or schema table
        setOperationMethod(method);

        if (schema) {
          setModel(schema);
        }

        if (method === "edit_capture") {
          setModelType("capture");
        } else {
          setModelType("schema");
        }

        if (tab) {
          setTab(tab);
          // Set up port to listen to content scruipt. Solution here https://stackoverflow.com/questions/54181734/chrome-extension-message-passing-unchecked-runtime-lasterror-could-not-establi
          const port = chrome.tabs.connect(tab?.id ?? 0);
          setPort(port);

          port.onMessage.addListener((message) => {
            console.log(message);
          });
  
        }
        // Render content when loaded
        setIsLoaded(true);
      }
    });
  }

  return (
    <div
      style={{
        height: "95vh",
        minHeight: 680,
        width: "100%",
        maxWidth: 400,
        position: "relative",
        pointerEvents: "none",
      }}
    >
      <ExtensionContext.Provider value={[currentTab, port]}>
        <SidePanelTemplate>
          {isLoaded ? (
            <SchemaFormTemplate
              modelType={modelType}
              model={model}
              operation={operationMethod}
            />
          ) : (
            <></>
          )}
        </SidePanelTemplate>
      </ExtensionContext.Provider>
    </div>
  );
};
