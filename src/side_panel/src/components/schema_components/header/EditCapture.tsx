import { useContext, useEffect, useMemo, useRef, useState } from "react";
import * as styles from "./header.module.css";
import useContent from "../../../../../shared/src/hooks/useContent";
import SchemaMatchesContext from "../../../context/SchemaMatches";
import { AppDropdown } from "../../../../../shared/src/components/dropdownSelector/AppDropdown";
import ModelReducerContext from "../../../context/ModelReducerContext";
import { EditButton } from "../../../../../shared/src/assets/icons/appIcons";

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

  const nameInputRef = useRef(null);
  const handleFocus = (e) => {
    e.current.focus();
  };

  return (
    <>
      <h3>Edit Capture</h3>

      <div className={styles.content_line}>
        <label htmlFor="">
          <b>URL Match:</b>{" "}
        </label>
        <textarea
          readOnly
          value={formModel.url_match}
          onChange={(e) => {
            modelReducerObject.update("url_match", e.target.value);
          }}
        />
      </div>

      <div className={styles.content_line}>
        <label htmlFor="">
          <b>Name:</b>{" "}
        </label>
        <input
          type="text"
          ref={nameInputRef}
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
            handleFocus(nameInputRef);
          }}
          title="Edit Capture Name"
        />
      </div>

      <div className={styles.content_line}>
        <b>Schema:</b>{" "}
        <AppDropdown
          options={schemaNames}
          set={matchingSchemasDetails[0].name}
          onChange={handleSchemaChange}
        ></AppDropdown>
      </div>

      <div className={styles.content_line}>
        <b>Project:  </b>{projectName ?? ""}
      </div>

      <div className={styles.table_header_container}>
        <h4 className={styles.table_header}>Capture</h4>
      </div>
    </>
  );
};
