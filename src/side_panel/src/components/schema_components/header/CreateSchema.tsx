import { useContext, useRef } from "react";
import * as styles from "./header.module.css";
import ModelReducerContext from "../../../context/ModelReducerContext";
import { EditButton } from "../../../../../shared/src/assets/icons/appIcons";

export const CreateSchemaHeader: React.FC<SchemaFormProps> = ({}) => {
  /**
   * Model reducer context
   */
  const [formModel, modelReducerObject] = useContext(ModelReducerContext);

  const urlInputRef = useRef(null);
  const schemaInputRef = useRef(null);

  const handleFocus = (e) => {
    e.current.focus();
  };
  return (
    <>
      <h3>Create Schema</h3>

      <div className={styles.url_content_line}>
        <label htmlFor="">
          <b>URL Match:</b>{" "}
        </label>
        <div className={styles.url_input_container}>
          <textarea
            rows={2}
            ref={urlInputRef}
            className={styles.url_match_input}
            value={formModel.url_match}
            onChange={(e) => {
              modelReducerObject.update("url_match", e.target.value);
            }}
            maxLength={100}
          />

          <EditButton
            pathFill="none"
            strokeColor="black"
            height={20}
            width={20}
            onClick={() => {
              handleFocus(urlInputRef);
            }}
            title="Edit URL"
          />
        </div>
      </div>

      <div className={styles.content_line}>
        <label htmlFor="" >
          <b>Schema Name:</b>{" "}
        </label>
        <input
          ref={schemaInputRef}
          value={formModel?.name ?? ""}
          onChange={(e) => {
            modelReducerObject.update("name", e.target.value);
          }}
          maxLength={20}
        />
        <EditButton
          pathFill="none"
          strokeColor="black"
          height={20}
          width={20}
          onClick={() => {
              handleFocus(schemaInputRef);
            }}
          title="Edit Schema Name"
        />
      </div>

      <div className={styles.table_header_container}>
        <h4 className={styles.table_header}>Schema</h4>
      </div>
    </>
  );
};
