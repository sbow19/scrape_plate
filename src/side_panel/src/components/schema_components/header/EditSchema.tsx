import { useContext, useMemo } from "react";
import * as styles from "./header.module.css";
import SchemaMatchesContext from "../../../context/SchemaMatches";
import { AppDropdown } from "../../../../../shared/src/components/dropdownSelector/AppDropdown";
import ModelReducerContext from "../../../context/ModelReducerContext";

export const EditSchemaHeader: React.FC<SchemaFormProps> = () => {
  /**
   * Model reducer context
   */
  const [formModel, modelReducerObject] = useContext(ModelReducerContext);

  const [matchingSchemasDetails, setModel] = useContext(SchemaMatchesContext);

  const schemaNames = useMemo(() => {
    const schemaNameArray = [];

    if (!Array.isArray(matchingSchemasDetails)) {
      return schemaNameArray.push(matchingSchemasDetails.name);
    }
    for (const schema of matchingSchemasDetails) {
      schemaNameArray.push(schema.name);
    }
    return schemaNameArray;
  }, [matchingSchemasDetails]);

  const handleSchemaChange = (e) => {
    // Find schema
    const matchedSchema = matchingSchemasDetails.find((schema) => {
      if (schema.name === e.target.value) {
        return schema;
      }
    });

    setModel(JSON.parse(JSON.stringify(matchedSchema)));
  };

  return (
    <>
      <h3>Edit Schema</h3>

      <div className={styles.content_line}>
        <label htmlFor="">
          <b>URL Match:</b>{" "}
        </label>
        <input
          type="text"
          value={formModel.url_match}
          onChange={(e) => {
            modelReducerObject.update("url_match", e.target.value);
          }}
          maxLength={20}
        />
      </div>

      <div className={styles.content_line}>
        <b>
          Schema:
          <AppDropdown
            options={schemaNames}
            set={matchingSchemasDetails[0].name}
            onChange={handleSchemaChange}
          ></AppDropdown>
        </b>{" "}
      </div>

      <div className={styles.table_header_container}>
        <h4>Schema</h4>
      </div>
    </>
  );
};
