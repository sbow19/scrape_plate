/**
 * Listen to events to open side panel
 */
import { SidePanelTemplate } from "./components/side_panel_template";
import { SchemaFormTemplate } from "./components/schema_form_template";
import { useEffect, useRef, useState } from "react";
import ExtensionContext from "./context/ExtensionObjects";
import {
  convertISOToDate,
  messageFactory,
} from "../../shared/src/utils/helpers";
import UserContent from "../../shared/src/state/state";
import useContent from "../../shared/src/hooks/useContent";
import SchemaMatchesContext from "./context/SchemaMatches";
import ModelReducerContext from "./context/ModelReducerContext";
import { useModel } from "./hooks/useModel";

export const App = () => {
  // Conditional load
  const [isLoaded, setIsLoaded] = useState(false);

  // Determine which content to show
  const [operationMethod, setOperationMethod] = useState<
    "create_schema" | "edit_schema" | "edit_capture"
  >("create_schema");

  // Set chrome tab details. Useful for url and id data.
  const [currentTab, setTab] = useState<chrome.tabs.Tab | null>(null);

  // Set port for communicating with content script
  const [port, setPort] = useState<chrome.runtime.Port | null>(null);

  // Matching schemas state
  const [matchingSchemas, setMatchingSchemas] = useState<Schema[]>([]);

  // Set model or models to keep track of model updates. May be sent in open side panel request
  const [model, setModel] = useState<Schema | Capture | null>(null);

  /**
   * Maintain local copy of schema or capture before updating the user content model
   * via service worker.
   *
   * UseModel is fed the model provided to it by the content scripts and other
   * locations.
   */
  const [formModel, modelReducerObject, focusedCell] = useModel(
    operationMethod,
    currentTab?.url ?? "",
    model
  );

  const [modelContext, setModelContext] = useState<
    [Schema | Capture, ReducerObject, string]
  >([formModel, modelReducerObject, focusedCell]);

  /**
   * Make model reducer object accessible throughout side panel
   */
  useEffect(() => {
    setModelContext([formModel, modelReducerObject, focusedCell]);
  }, [formModel, modelReducerObject, focusedCell]);

  // Set up userContentModel
  const userContentEvents = useContent();

  //Has loaded UserContentModel
  const hasLoaded = useRef(false);
  const [noCurrentProject, setNoCurrentProject] = useState(false);
  useEffect(() => {
    if (!hasLoaded.current) {
      userContentEvents
        .emit("fetch", "")
        .then((re: UserContentModel) => {
          if (!re.details.currentProject) setNoCurrentProject(true);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, []);

  /**
   *  Listen to messages from the calling location, which will details on wht to render
   *  in the side panel. The side panel loads the schema data
   *
   *  Once schema data is loaded, send a message to content script to fetch data according
   *  to schema provided.
   */
  const eventListLoadRef = useRef(false);
  const operationMethodDetRef = useRef(false);
  if (!eventListLoadRef.current) {
    eventListLoadRef.current = true;
    /**
     * Edit capture logic
     */
    chrome.runtime.onMessage.addListener((message: BackendMessage) => {
      if (message.operation === "openSidePanel") {
        const { schema, tab, method } = message.data;

        // Set up port to listen to content script. Solution here https://stackoverflow.com/questions/54181734/chrome-extension-message-passing-unchecked-runtime-lasterror-could-not-establi
        if (!port) {
          const newPort = chrome.tabs.connect(tab?.id ?? 0);
          setPort(newPort);
        }

        /**
         * Only handle edit capture logic
         */
        if (method !== "edit_capture") return;

        if (!schema) return;

        // Set tab
        setTab(tab);

        /**
         * If a capture has been sent, then set this as the content
         * to be shown.
         *
         * Else if array of schemas, then set index 0 of array to current model,
         * then set the matching array state.
         */
        if (!Array.isArray(schema)) {
          setModel(schema);
        } else if (Array.isArray(schema)) {
          setModel(schema[0]);
          setMatchingSchemas(schema);
        }

        /**
         * Render content
         */
        setIsLoaded(true);
        setOperationMethod(method);

        /**
         * Allow port listeners to be set up
         */
        operationMethodDetRef.current = true;
      }
    });

    /**
     * Edit schema logics
     */
    chrome.runtime.onMessage.addListener((message: BackendMessage) => {
      if (message.operation === "openSidePanel") {
        const { schema, tab, method } = message.data;

        // Set up port to listen to content scruipt. Solution here https://stackoverflow.com/questions/54181734/chrome-extension-message-passing-unchecked-runtime-lasterror-could-not-establi
        if (!port) {
          const newPort = chrome.tabs.connect(tab?.id ?? 0);
          setPort(newPort);
        }

        /**
         * Only handle schema operations
         */
        if (method === "edit_capture") return;
        if (!schema) return;

        setTab(tab);

        /**
         * If a capture has been sent, then set this as the content
         * to be shown.
         *
         * Else if array of schemas, then set index 0 of array to current model,
         * then set the matching array state.
         */
        if (!Array.isArray(schema)) {
          setModel(schema);
          setMatchingSchemas([schema]);
        } else if (Array.isArray(schema)) {
          setModel(schema[0]);
          setMatchingSchemas(schema);
        }

        // Operation determines whether to use capture or schema table
        setOperationMethod(method);

        // Render content when loaded
        setIsLoaded(true);

        /**
         * Allow port listeners to be set up
         */
        operationMethodDetRef.current = true;
      }
    });
  }

  // Reset schema model with data from frontend
  const genCaptureBody = (message: BackendMessage) => {
    if (message.operation === "sendDOMData") {
      if (message.data.type === "fetchMany") {
        const data = message.data.data as SchemaModel;
        const newDate = new Date().toISOString();
        const newDataConv = convertISOToDate(newDate);


        // Get current project details
        userContentEvents
          ?.emit("getAllOf", "details")
          .then((userDetails: UserContentDetails) => {
            const searchOptions: SearchOptions = {
              type: "project",
              term: userDetails.currentProject ?? "",
            };

            return userContentEvents.emit("search", searchOptions);
          })
          .then((results: ProjectGroup[]) => {
            if (results.length > 0) {
              const capture: Capture = {
                capture_body: data,
                id: crypto.randomUUID(),
                date_created: newDataConv ?? "",
                last_edited: newDataConv ?? "",
                schema_id: model.id,
                url_match: currentTab?.url ?? "",
                name: "",
                project_id: results[0].id,
              };

              modelReducerObject.reset(capture);
            }
          })
          .catch((e) => {
            console.log(e);
          })
          .finally(() => {
            UserContent.hasLoaded = true;
          });
      }
    }
  };

  /**
   * Reset the schema model with new data from content script
   * @param message
   */
  const genSchemaBody = (message: BackendMessage) => {
    if (message.operation === "sendDOMData") {
      if (message.data.type === "fetchMany") {
        const data = message.data.data as SchemaModel;

        const schemaCapture: Schema = {
          schema: data,
          id: model.id,
          url_match: model.url_match,
          name: model.name,
        };



        modelReducerObject.reset(schemaCapture);
      }
    }
  };

  /**
   * Set up port listeners to listen content script sending messages, once the operation method
   * has been determined. With the operation method determined
   */
  const listenerRef = useRef(false);
  useEffect(() => {
    if (listenerRef.current) return;
    if (!operationMethodDetRef.current) return;
    listenerRef.current = true;
    port.onMessage.addListener((message) => {
      if (operationMethod === "edit_capture") genCaptureBody(message);
      if (operationMethod === "edit_schema") genSchemaBody(message);
    });
  }, [operationMethod]);

  /**
   * Send messages to port once:
   * 1) Operation method determined,
   * 2) port listeners set up.
   *
   * Trigger every time model changes
   */
  useEffect(() => {
    if (!port) return;
    if (!operationMethodDetRef.current) return;
    if (!listenerRef.current) return;

    /* Execute scrape logic */
    const backendMessage = messageFactory("sendDOMData", {
      type: "fetchMany",
      data: model,
    });

    port.postMessage(backendMessage);
  }, [model, operationMethod]);

  return (
    <div
      style={{
        height: "95vh",
        minHeight: 680,
        width: "clamp(340px, 100%, 525px)",
        position: "relative",
        pointerEvents: "none",
      }}
    >
      <SchemaMatchesContext.Provider value={[matchingSchemas, setModel]}>
        <ModelReducerContext.Provider value={modelContext}>
          <ExtensionContext.Provider value={[currentTab, port]}>
            <SidePanelTemplate>
              {/**
               *  Conditional rendering logic:
               *  1) All schema form templates do not render if isLoaded is false
               * 2)  If operation method is crere_schema, this renders regardless of other state
               * 3) For both edit_schema and edit_capture, if n schema model provided, then they ont render
               * 4) If operation is edit capture, then only render if there is a current project
               * 5) Else if edit_schema, then you dont need a current project
               */}
              {isLoaded && operationMethodDetRef.current ? 
              (
                operationMethod === "create_schema" ? <SchemaFormTemplate operation={operationMethod} />:
                 (
                  matchingSchemas.length === 0 ? <>No schema Provided</> : 
                  (
                    operationMethod === "edit_capture" ? (
                      noCurrentProject ? <>Must have current project to make capture</>: <SchemaFormTemplate operation={operationMethod}/> 
                    ):(
                       <SchemaFormTemplate operation={operationMethod}/>
                    )
                  )

                 )
              ):
              <>Unable to load side panel</>
              }

            </SidePanelTemplate>
          </ExtensionContext.Provider>
        </ModelReducerContext.Provider>
      </SchemaMatchesContext.Provider>
    </div>
  );
};
