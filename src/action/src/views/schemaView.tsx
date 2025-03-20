/**
 * Schema search page
 */
import { AppButtonTemplate } from "../../../shared/src/components/buttons/appButton";
import { AppTableTemplate } from "../../../shared/src/components/table/appTable";
import { tableDataConverter } from "../../../shared/src/utils/helpers";
import { PopupTemplate } from "../components/popup_template";
import { useCallback, useMemo, useRef, useState } from "react";
import * as styles from "./schemaView.module.css";
import {
  EditButton,
  HomeButton,
} from "../../../shared/src/assets/icons/appIcons";

import { useParams } from "react-router";

export const SchemaView = () => {
  /* IMPLEMENT: Get schema data using schema id*/
  const params = useParams()
  console.log(params)
  const schemaData = scheman;
  return (
    <>
      <PopupTemplate
        contentComponent={<ContentComponent schemaData={schemaData} />}
        secondaryActions={<SecondaryActions />}
        primaryAction={<PrimaryAction />}
        backButtonEnabled={true}
      />
    </>
  );
};

const ContentComponent = ({ schemaData }) => {
  /**
   * Convert capture details to form usable by table template, i.e. table data type
   */

  /**
   * Schema name handlers
   */
  const inputNameRef = useRef<HTMLInputElement>(null);
  const handleFocus = useCallback(() => {
    if (inputNameRef.current) {
      inputNameRef.current.readOnly = false;
      inputNameRef.current.focus();
    }
  }, []);
  const handleBlur = useCallback(() => {
    if (inputNameRef.current) {
      inputNameRef.current.readOnly = true;
    }
  }, []);

  const [currentName, setCurrentName] = useState(schemaData.name);
  const handleChangeText = useCallback((e) => {
    setCurrentName(e.value);
  }, []);


  /**
   * Schema url match details
   */
  const schemaDetailsTable: TableData = useMemo(() => {
    return tableDataConverter("schema", Object.values(schemaData.schema));
  }, [schemaData]);

  return (
    <>
      {" "}
      <div className={styles.project_info_container}>
        <div className={styles.project_name_container}>
          <h3>
            Schema:{" "}
            <input
              ref={inputNameRef}
              type="text"
              value={currentName}
              className={styles.input_field}
              readOnly
              onBlur={handleBlur}
              onChange={handleChangeText}
            />
          </h3>
          <EditButton
            height={20}
            width={20}
            onClick={handleFocus}
            title="Edit Name"
          />
        </div>
        <div className={styles.created_at}>
          <h3>
            URL Match:{" "}
            {schemaData.url_match}
          </h3>
        </div>
        <div className={styles.table_title}>Schema Details</div>
      </div>
      <div className={styles.table_container}>
        <AppTableTemplate
          tableData={schemaDetailsTable}
          options={null}
        />
      </div>
    </>
  );
};

const SecondaryActions = () => {
  return (
    <div className={styles.button_container}>
      <AppButtonTemplate
        textStyle={{
          fontSize: 14,
          color: "#fb3640ff",
        }}
      >
        Delete
      </AppButtonTemplate>
      <AppButtonTemplate
        textStyle={{
          fontSize: 14,
        }}
      >
        Edit
      </AppButtonTemplate>
      <AppButtonTemplate
        textStyle={{
          fontSize: 14,
          color: "#006400",
        }}
      >
        Save Changes
      </AppButtonTemplate>
    </div>
  );
};

const PrimaryAction = () => {
  return (
    <>
      {" "}
      <HomeButton height={30} width={30} />
    </>
  );
};

const scheman: Schema = {
  id: "s11aa111-11aa-1111-a111-1a11a1a1a112",
  name: "schema2",
  url_match: "https://www.google.com",
  schema: {
    id: {
      key: {
        match_expression: null,
        match_type: "manual",
        matched_value: "location",
      },
      value: {
        match_expression: "locationid",
        match_type: "id",
        matched_value: null,
      },
    },
    name: {
      key: {
        match_expression: "id3",
        match_type: "id",
        matched_value: "name",
      },
      value: {
        match_expression: "id4",
        match_type: "id",
        matched_value: null,
      },
    },
  },
};
