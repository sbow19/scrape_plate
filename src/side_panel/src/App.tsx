/**
 * Listen to events to open side panel
 */
import { SidePanelTemplate } from "./components/side_panel_template";
import { SchemaFormTemplate } from "./components/schema_form_template";
import { useRef, useState } from "react";

export const App = () => {
  // Listen for messages from backend, here the reason for
  const eventLisRef = useRef(false);

  const [isLoaded, setIsLoaded] = useState(false)
  const [operationMethod, setOperationMethod] = useState< "create_schema" | "edit_schema" | "edit_capture">('create_schema');
  const [modelType, setModelType] = useState<'capture' | 'schema'>('capture')
  const [model, setModel] = useState<Schema | Capture | Schema[] | null>(null)

  // Global url 
  const urlRef = useRef('')


  if(!eventLisRef.current) {
    eventLisRef.current = true;

    chrome.runtime.onMessage.addListener((message: BackendMessage)=>{
      if(message.operation === 'openSidePanel'){

        const {schema, tab, method} = message.data

        setOperationMethod(method)

        if(schema){
          setModel(schema)
        }
        
        if(method === 'edit_capture'){
          setModelType(prev=>'capture')
        } else {
          setModelType(prev=>'schema')
        }

        if(tab){
          urlRef.current = tab.url

          console.log(urlRef)
        }

        setIsLoaded(prev=>true)
      }
    })
  }

  return (
    <div
        style={{
            height: '95vh',
            minHeight: 680,
            width: '100%',
            maxWidth: 400,
            position: 'relative',
            pointerEvents: 'none'
        }}
    >
      <SidePanelTemplate>
        {
          isLoaded? <SchemaFormTemplate
          modelType={modelType}
          model={model}
          operation={operationMethod}
          currentURL={urlRef.current}
        /> : <></>
        }
        
      </SidePanelTemplate>
    </div>
  );
};
