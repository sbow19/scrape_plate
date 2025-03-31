import { useCallback, useContext } from "react";
import { useModel } from "../hooks/useModel";
import * as styles from "./schema_form_template.module.css";

import ToastContext from "../context/Toast";
import ExtensionContext from "../context/ExtensionObjects";
import { AppButtonTemplate } from "../../../shared/src/components/buttons/appButton";

import { CreateSchemaHeader } from "./schema_components/header/CreateSchema";
import { EditCaptureHeader } from "./schema_components/header/EditCapture";
import { EditSchemaHeader } from "./schema_components/header/EditSchema";

import { SchemaTable } from "./schema_components/table/SchemaTable";
import { CaptureTable } from "./schema_components/table/CaptureTable";
import { messageFactory } from "../../../shared/src/utils/helpers";
/**
 * Captures, edit, and schema creator views are forms the user can interact with
 * , in that they can be edited, deleted etc. A buffered version of the schema or
 * capture is held locally by the useContent hook, and can be updated using the
 * reducerObject returned by the hook.
 *
 * Once a user is ready to save changes, the local copy of the schema or capture
 * is sent to the service worker to be saved in the IndexedDB store.
 */

export const SchemaFormTemplate: React.FC<SchemaFormTemplateProps> = ({
  modelType,
  operation,
  model,
}) => {
  /**
   * Chrome tab data and communication port to send messages with content script.
   */
  const [tab, port] = useContext(ExtensionContext);

  /**
   * Maintain local copy of schema or capture before updating the user content model
   * via service worker.
   */
  const [formModel, modelReducerObject, focusedCell] = useModel(
    modelType,
    tab?.url ?? "",
    model
  );

  /**
   * Reset changes to existing schema or capture model
   */
  const handleReset = () => {
    modelReducerObject.reset(model);
  };

  const [, setToastState] = useContext(ToastContext);

  /**
   * Trigger save to IndexedDB via service worker
   */
  const handleSave = () => {
    setToastState({
      open: true,
      text: <p>Do you want to save changes?</p>,
      buttons: [
        <AppButtonTemplate
          onClick={() => {
            setToastState({
              open: false,
            });
          }}
        >
          No
        </AppButtonTemplate>,
        <AppButtonTemplate
          onClick={() => {
            // Trigger save operation

            const newSchemaOp: CRUDDataOptions = {
              method: "",
              type: "",
              data: {}
            } 

            switch(operation){
              case "create_schema":
                newSchemaOp.method = "create"
                newSchemaOp.type = "schema"
                newSchemaOp.data = formModel
                break
              case "edit_capture":
                break
              case "edit_schema":
                newSchemaOp.method = "update"
                newSchemaOp.type = "schema"
                newSchemaOp.data = formModel
                break
              default:
                setToastState({
                  open: true,
                  text: <p>Oops! Something went wrong</p>,
                  timer: 1250
                })
                break
            }
            const backendMessage = messageFactory("database", newSchemaOp)
            chrome.runtime.sendMessage(backendMessage)
            .then((be: BackendResponse)=>{

              if(be.data.success){
                setToastState({
                  open: true,
                  text: <p>Changes saved successfully!</p>,
                  timer: 1250
                });

                modelReducerObject.reset(formModel)
              }

            })
            .catch((be: BackendResponse)=>{
              setToastState({
                open: true,
                text: <p>Oops! Changes not saved successfully</p>,
                timer: 1250
              });
            })
            


            // Disconnect connection with content script
            port?.disconnect()
          }}

        >
          Yes
        </AppButtonTemplate>,
      ],
    });
  };

  let headerComponent: React.ReactNode = <></>;

  switch (operation) {
    case "create_schema":
      headerComponent = (
        <CreateSchemaHeader
          formModel={formModel}
          modelReducerObject={modelReducerObject}
        ></CreateSchemaHeader>
      );
      break;
    case "edit_schema":
      headerComponent = (
        <EditSchemaHeader
          formModel={formModel}
          modelReducerObject={modelReducerObject}
        ></EditSchemaHeader>
      );
      break;
    case "edit_capture":
      headerComponent = (
        <EditCaptureHeader
          formModel={formModel}
          modelReducerObject={modelReducerObject}
        ></EditCaptureHeader>
      );
      break;
    default:
      break;
  }

  return (
    <>
      <div className={styles.schema_form_wrapper}>
        <div className={styles.schema_details_container}>
          {/* Custom components depending on operation */}
          {headerComponent}
        </div>

        <div className={styles.schema_content_container}>
          {/*custom content depending on operation  */}
          {operation === "edit_capture" ? (
            <CaptureTable
              formModel={formModel}
              modelReducerObject={modelReducerObject}
              operation={operation}
              focusedCell={focusedCell}
            />
          ) : (
            <SchemaTable
              formModel={formModel}
              modelReducerObject={modelReducerObject}
              operation={operation}
              focusedCell={focusedCell}

            ></SchemaTable>
          )}
        </div>

        <div className={styles.schema_button_container}>
          <AppButtonTemplate onClick={handleReset}>Reset</AppButtonTemplate>
          <AppButtonTemplate onClick={handleSave}>
            Save Changes
          </AppButtonTemplate>
        </div>
      </div>
    </>
  );
};
