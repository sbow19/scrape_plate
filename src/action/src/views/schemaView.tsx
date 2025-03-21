/**
 * Schema search page
 */
import { AppButtonTemplate } from "../../../shared/src/components/buttons/appButton";
import { AppTableTemplate } from "../../../shared/src/components/table/appTable";
import { tableDataConverter } from "../../../shared/src/utils/helpers";
import { PopupTemplate } from "../components/popup_template";
import { useCallback, useContext, useMemo, useRef, useState } from "react";
import * as styles from "./schemaView.module.css";
import {
  EditButton,
  HomeButton,
} from "../../../shared/src/assets/icons/appIcons";

import { useNavigate, useParams } from "react-router";
import ToastContext from "../context/Toast";

export const SchemaView = () => {
  /* IMPLEMENT: Get schema data using schema id*/
  const params = useParams();
  return (
    <>
      <PopupTemplate
        contentComponent={<ContentComponent schemaData={{}} />}
        secondaryActions={<SecondaryActions schemaId={''} schemaName={''}/>}
        primaryAction={<PrimaryAction />}
        backButtonEnabled={true}
      />
    </>
  );
};

const ContentComponent = ({ schemaData }) => {

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
    if(!schemaData.schema) return {}
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
          <h3>URL Match: {schemaData.url_match}</h3>
        </div>
        <div className={styles.table_title}>Schema Details</div>
      </div>
      <div className={styles.table_container}>
        <AppTableTemplate tableData={schemaDetailsTable} options={null} />
      </div>
    </>
  );
};

const SecondaryActions = ({
  schemaId,
  schemaName
}) => {
  const [toastState, setToastState] = useContext(ToastContext);

  /**
   * Delete Schema toast trigger handler
   */
  const handleDeleteSchema = useCallback(() => {
    setToastState((prevState) => ({
      ...prevState,
      open: true,
      text: <p> Are you sure you want to delete {schemaName}?</p>, // Usually name of entry
      buttons: [
        <AppButtonTemplate
          onClick={()=>{
            setToastState(prevState=>({
              open: false
            }))
          }}
        > No </AppButtonTemplate>,
        <AppButtonTemplate
        onClick={()=>{
          /* IMPLEMENT: trigger delete */
          setToastState(prevState=>({
            open: false
          }))

        }}
        > Yes </AppButtonTemplate>,
      ]
    }));
  }, [toastState]);

  /**
   * Export Schema toast trigger handler
   */
  const handleEditSchema = useCallback(() => {
    setToastState((prevState) => ({
      ...prevState,
      open: true,
    }));
  }, [toastState]);

  /**
   * Save Schema toast trigger handler
   */
  const handleSaveSchema = useCallback(() => {
    setToastState((prevState) => ({
      ...prevState,
      open: true,
      text:<p> Save changes to {schemaName}?</p>,
      buttons: [
        <AppButtonTemplate
          onClick={()=>{
            setToastState(prevState=>({
              open: false
            }))
          }}
        > No </AppButtonTemplate>,
        <AppButtonTemplate
        onClick={()=>{
          /* IMPLEMENT: trigger delete */
          setToastState(prevState=>({
            open: false
          }))

        }}
        > Yes </AppButtonTemplate>,
      ]
    }));
  }, [toastState]);
  return (
    <div className={styles.button_container}>
      <AppButtonTemplate
        textStyle={{
          fontSize: 14,
          color: "#fb3640ff",
        }}
        onClick={handleDeleteSchema}
      >
        Delete
      </AppButtonTemplate>
      <AppButtonTemplate
        textStyle={{
          fontSize: 14,
        }}
        onClick={handleEditSchema}
      >
        Edit
      </AppButtonTemplate>
      <AppButtonTemplate
        textStyle={{
          fontSize: 14,
          color: "#006400",
        }}
        onClick={handleSaveSchema}
      >
        Save Changes
      </AppButtonTemplate>
    </div>
  );
};

const PrimaryAction = () => {
  const navigate = useNavigate();
  return (
    <>
      {" "}
      <HomeButton
        height={30}
        width={30}
        onClick={() => {
          navigate("/");
        }}
      />
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
