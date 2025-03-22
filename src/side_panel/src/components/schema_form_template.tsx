import { useMemo, useRef } from "react";
import { useModel } from "../hooks/useModel";
import * as styles from "./schema_form_template.module.css";
import { tableDataConverter } from "../../../shared/src/utils/helpers";
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
}) => {
  const [formModel, modelReducerObject] = useModel(modelType, model);

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
          <SchemaFormTable
            formModel={formModel}
            modelReducerObject={modelReducerObject}
            operation={operation}
          />
        </div>
      </div>
    </>
  );
};

const CreateSchemaHeader: React.FC<SchemaFormProps> = ({
  formModel,
  modelReducerObject,
}) => {
  return (
    <>
      <h3>Create Schema</h3>

      <div className={styles.content_line}>
        <label htmlFor="">
          <b>URL Match:</b>{" "}
        </label>
        <input
          className={styles.app_input}
          type="text"
          value={formModel.url_match}
          onChange={(e) => {
            modelReducerObject.update("url_match", e.target.value);
          }}
          maxLength={100}
        />
      </div>

      <div className={styles.content_line}>
        <label htmlFor="">
          <b>Schema Name:</b>{" "}
        </label>
        <input
          className={styles.app_input}
          type="text"
          value={formModel.name}
          onChange={(e) => {
            modelReducerObject.update("name", e.target.value);
          }}
          maxLength={20}
        />
      </div>

      <div className={styles.table_header_container}>
        <h4>Schema</h4>
      </div>
    </>
  );
};

const EditSchemaHeader: React.FC<SchemaFormProps> = ({
  formModel,
  modelReducerObject,
}) => {
  return (
    <>
      <h3>Edit Schema</h3>

      <div className={styles.content_line}>
        <label htmlFor="">
          <b>URL Match:</b>{" "}
        </label>
        <input
          className={styles.app_input}
          type="text"
          value={formModel.url_match}
          onChange={(e) => {
            modelReducerObject.update("url_match", e.target.value);
          }}
          maxLength={20}
        />
      </div>

      <div className={styles.content_line}>
        <label htmlFor="">
          <b>Schema Name:</b>{" "}
        </label>
        <input
          className={styles.app_input}
          type="text"
          value={formModel.name}
          onChange={(e) => {
            modelReducerObject.update("name", e.target.value);
          }}
          maxLength={20}
        />
      </div>

      <div className={styles.table_header_container}>
        <h4>Schema</h4>
      </div>
    </>
  );
};

const EditCaptureHeader: React.FC<SchemaFormProps> = ({
  formModel,
  modelReducerObject,
}) => {
  /* FETCH PROJECT NAME AND CAPTURE NAME FROM USER CONTENT MODEL */
  return (
    <>
      <h3>Edit Capture</h3>

      <div className={styles.content_line}>
        <label htmlFor="">
          <b>URL Match: {formModel.url_match}</b>{" "}
        </label>
      </div>

      <div className={styles.content_line}>
        <label htmlFor="">
          <b>Name:</b>{" "}
        </label>
        <input
          className={styles.app_input}
          type="text"
          value={formModel.name}
          onChange={(e) => {
            modelReducerObject.update("name", e.target.value);
          }}
          maxLength={20}
        />
      </div>

      <div className={styles.content_line}>
        <p>
          <b>Schema:</b>{" "}
        </p>
      </div>

      <div className={styles.content_line}>
        <p>
          <b>Project:</b>{" "}
        </p>
      </div>

      <div className={styles.table_header_container}>
        <h4>Capture</h4>
      </div>
    </>
  );
};

/**
 * When keys are deleted, updated or added, call the modelREducerObject
 * update function with all the keys stored in the Schema Form Table.
 */
const CaptureFormTable: React.FC<SchemaFormTableProps> = ({
  operation,
  formModel,
  modelReducerObject,
}) => {
  // Turn the data into the tabledata object
  const tableData = useMemo(() => {
    return tableDataConverter('capture', formModel);
  }, [formModel]);

  return (
    <>
      {tableData?.data && (
        <table className={styles.table_outer}>
          <thead>
            {tableData.header.map((header, index) => {
              return (
                <>
                  <td key={index}>{header}</td>
                </>
              );
            })}
          </thead>

          <tbody className={styles.table_body}>
            {tableData.data.map((row, index) => {
              return (
                <tr key={index}>
                  {row.map((dataPoint, index) => {
                    // Skip first element as its reserved for ids
                    if (index === 0) return;
                    return (
                      <td key={index}>
                        {dataPoint}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
};
