import { useContext, useRef } from "react";
import { useModel } from "../hooks/useModel";
import * as styles from "./schema_form_template.module.css";

import ToastContext from "../context/Toast";
import { AppButtonTemplate } from "../../../shared/src/components/buttons/appButton";

import { CreateSchemaHeader } from "./schema_components/header/CreateSchema";
import { EditCaptureHeader } from "./schema_components/header/EditCapture";
import { EditSchemaHeader } from "./schema_components/header/EditSchema";

// import { dummySchemaModel, dummyCaptureModel } from "../test/dummyData";
import { SchemaTable } from "./schema_components/table/SchemaTable";
import { CaptureTable } from "./schema_components/table/CaptureTable";
/**
 * Captures, edit, and schema creator views are forms, in that
 * they can be edited, deleted etc. Saving a  new schema, editing
 * ame existing schema, or getting a new capture will trigger
 * an IndexedDB operation using the data collected from the form.
 *
 *
 */

export const SchemaFormTemplate: React.FC<SchemaFormTemplateProps> = ({
  modelType,
  operation,
  model,
  currentURL
}) => {
  /**
   * Maintain local copy of schema or capture before updating the user content model
   * in the backend
   */

  const [formModel, modelReducerObject] = useModel(modelType, model);

  /**
   * Reset changes to existing schema or capture model
   */
  const handleReset = () => {
    modelReducerObject.reset();
  };


  const [, setToastState] = useContext(ToastContext);

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
            setToastState({
              open: false,
            });
          }}
        >
          Yes
        </AppButtonTemplate>,
      ],
    });
  };

  // Header
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
            />
          ) : (
            <SchemaTable
              formModel={formModel}
              modelReducerObject={modelReducerObject}
              operation={operation}
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
