import { useContext, useEffect, useMemo, useState } from "react";
import * as styles from "./header.module.css";
import useContent from "../../../../../shared/src/hooks/useContent";
import SchemaMatchesContext from "../../../context/SchemaMatches";
import { AppDropdown } from "../../../../../shared/src/components/dropdownSelector/AppDropdown";
import ModelReducerContext from "../../../context/ModelReducerContext";

export const EditCaptureHeader: React.FC<SchemaFormProps> = () => {
  /**
   * Model reducer context
   */
  const [formModel, modelReducerObject] = useContext(ModelReducerContext);
  /* FETCH PROJECT NAME AND CAPTURE NAME FROM USER CONTENT MODEL */


  const [projectName, setProjectName] = useState("");

  const [matchingSchemasDetails, setModel] = useContext(SchemaMatchesContext);

  const schemaNames = useMemo(() => {
    const schemaNameArray = [];
    for (const schema of matchingSchemasDetails) {
      schemaNameArray.push(schema.name);
    }
    return schemaNameArray;
  }, [matchingSchemasDetails]);

  const userContentEvents = useContent();

  useEffect(() => {
    if (!formModel || !formModel?.project_id) return;

    userContentEvents
      ?.emit("search", {
        type: "project",
        term: formModel.project_id,
      })
      .then((projects: ProjectGroup[]) => {
        if (projects.length > [0]) {
          setProjectName(projects[0].name);
        }
      })
      .catch((e) => {
        console.log("Error fetching project name", e);
      });
  }, [matchingSchemasDetails, formModel]);

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
          type="text"
          value={formModel?.name ?? ""}
          onChange={(e) => {
            modelReducerObject.update("name", e.target.value);
          }}
          maxLength={20}
        />
      </div>

      <div className={styles.content_line}>
        <p>
          <b>
            Schema:
            <AppDropdown
              options={schemaNames}
              set={matchingSchemasDetails[0].name}
              onChange={handleSchemaChange}
            ></AppDropdown>
          </b>{" "}
        </p>
      </div>

      <div className={styles.content_line}>
        <p>
          <b>Project: {projectName ?? ""} </b>{" "}
        </p>
      </div>

      <div className={styles.table_header_container}>
        <h4>Capture</h4>
      </div>
    </>
  );
};
