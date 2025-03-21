/**
 * Capture search page
 */
import { PopupTemplate } from "../components/popup_template";
import { AppButtonTemplate } from "../../../shared/src/components/buttons/appButton";
import { AppTableTemplate } from "../../../shared/src/components/table/appTable";
import { useState, useCallback, useRef, useMemo, useContext } from "react";
import * as styles from "./captureView.module.css";
import {
  EditButton,
  HomeButton,
} from "../../../shared/src/assets/icons/appIcons";
import {
  convertISOToDate,
  tableDataConverter,
} from "../../../shared/src/utils/helpers";
import ToastContext from "../context/Toast";
import { AppDropdown } from "../../../shared/src/components/dropdownSelector/AppDropdown";
import { useNavigate } from "react-router";

export const CaptureView = () => {
  /*IMPLEMENT: Get project details */
  return (
    <>
      <PopupTemplate
        contentComponent={
          <ContentComponent
            projectDetails={projectDetailsn}
            captureId={captureIdn}
          />
        }
        secondaryActions={
          <SecondaryActions
            projectDetails={projectDetailsn}
            captureId={captureIdn}
          />
        }
        primaryAction={<PrimaryAction />}
        backButtonEnabled={true}
      />
    </>
  );
};

const ContentComponent = ({ projectDetails, captureId }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFocus = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.readOnly = false;
      inputRef.current.focus();
    }
  }, []);
  const handleBlur = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.readOnly = true;
    }
  }, []);

  // Input value
  const [currentName, setCurrentName] = useState(projectDetails.captures[captureId].name);
  const handleChangeText = useCallback((e) => {
    setCurrentName(e.value);
  }, []);

  /**
   * Convert capture details to form usable by table template, i.e. table data type
   */

  const captureDetails: Capture = useMemo(() => {
    return projectDetails.captures[captureId];
  }, [projectDetails, captureId]);

  const captureDetailsTable: TableData = useMemo(() => {
    console.log(projectDetails.captures[captureId]);
    return tableDataConverter(
      "capture",
      Object.values(projectDetails.captures[captureId].capture_body)
    );
  }, [projectDetails, captureId]);

  return (
    <>
      <div className={styles.project_info_container}>
        <div className={styles.project_name_container}>
          <h3>
            Capture:
            <input
              ref={inputRef}
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
          Created At: {convertISOToDate(captureDetails.date_created)}
        </div>
        <div className={styles.last_edited}>
          Last Edited: {convertISOToDate(captureDetails.last_edited)}
        </div>
        <div className={styles.table_title}>Captured Data</div>
      </div>
      <div className={styles.table_container}>
        <AppTableTemplate
          tableData={captureDetailsTable}
          options={{
            enableDelete: true,
            enableEdit: false,
            enableInLineEdit: true,
          }}
        />
      </div>
    </>
  );
};

const SecondaryActions = ({ projectDetails, captureId }) => {
  const [toastState, setToastState] = useContext(ToastContext);
  /**
   * Delete Capture toast trigger handler
   */
  const handleSaveCapture = useCallback(() => {
    setToastState((prevState) => ({
      ...prevState,
      open: true,
      text:<p> Save changes to capture?</p>,
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
   * Export Capture toast trigger handler
   */
  const handleDeleteCapture = useCallback(() => {
    setToastState((prevState) => ({
      ...prevState,
      open: true,
      text: (
        <p>
          {" "}
          Are you sure you want to delete{" "}
          {projectDetails.captures[captureId].name}?
        </p>
      ), // Usually name of entry
      buttons: [
        <AppButtonTemplate
          onClick={() => {
            setToastState((prevState) => ({
              open: false,
            }));
          }}
        >
          {" "}
          No{" "}
        </AppButtonTemplate>,
        <AppButtonTemplate
          onClick={() => {
            /* IMPLEMENT: trigger delete */
            setToastState((prevState) => ({
              open: false,
            }));
          }}
        >
          {" "}
          Yes{" "}
        </AppButtonTemplate>,
      ],
    }));
  }, [toastState]);

  /**
   * Save Capture toast trigger handler
   */
  const handleExportCapture = useCallback(() => {
    setToastState((prevState) => ({
      ...prevState,
      open: true,
      text: <p>How do you want to export {projectDetails.captures[captureId].name}?</p>,
      buttons: [
        <AppButtonTemplate
          onClick={() => {
            setToastState((prevState) => ({
              open: false,
            }));
          }}
        >
          Back
        </AppButtonTemplate>,
        <AppDropdown options={["json", "excel"]} data={projectDetails.captures[captureId]} />,
      ],
    }));
  }, [toastState]);
  return (
    <div className={styles.button_container}>
      <AppButtonTemplate
        textStyle={{
          fontSize: 14,
          color: "#fb3640ff",
        }}
        onClick={handleDeleteCapture}
      >
        Delete
      </AppButtonTemplate>
      <AppButtonTemplate
        textStyle={{
          fontSize: 14,
        }}
        onClick={handleExportCapture}
      >
        Export
      </AppButtonTemplate>
      <AppButtonTemplate
        textStyle={{
          fontSize: 14,
          color: "#006400",
        }}
        onClick={handleSaveCapture}
      >
        Save Changes
      </AppButtonTemplate>
    </div>
  );
};

const PrimaryAction = () => {
  const navigate = useNavigate()
  return (
    <>
      <HomeButton height={30} width={30} onClick={()=>{
        navigate('/')
      }}/>
    </>
  );
};

const captureIdn = "c11aa111-11aa-1111-a111-1a11a1a1a112";

const projectDetailsn: ProjectGroup = {
  name: "project1",
  date_created: "2025-01-10T14:30:00",
  last_edited: "2025-03-13T14:30:00",
  id: "a11aa111-11aa-1111-a111-1a11a1a1a111",
  captures: {
    "c11aa111-11aa-1111-a111-1a11a1a1a111": {
      id: "c11aa111-11aa-1111-a111-1a11a1a1a111",
      url_match: "https://",
      date_created: "2025-01-11T14:30:00",
      last_edited: "2025-01-12T14:30:00",
      project_id: "a11aa111-11aa-1111-a111-1a11a1a1a111",
      schema_id: "s11aa111-11aa-1111-a111-1a11a1a1a111",
      name: "capture1",
      capture_body: {
        location: {
          key: {
            match_expression: "id1",
            match_type: "id",
            matched_value: "location",
          },
          value: {
            match_expression: "id2",
            match_type: "id",
            matched_value: "Hamburg",
          },
        },
        age: {
          key: {
            match_expression: null,
            match_type: "manual",
            matched_value: "age",
          },
          value: {
            match_expression: "id4",
            match_type: "id",
            matched_value: "22",
          },
        },
      },
    },
    "c11aa111-11aa-1111-a111-1a11a1a1a112": {
      id: "c11aa111-11aa-1111-a111-1a11a1a1a112",
      date_created: "2025-01-11T14:30:00",
      last_edited: "2025-01-12T14:30:00",
      schema_id: "s11aa111-11aa-1111-a111-1a11a1a1a112",
      project_id: "a11aa111-11aa-1111-a111-1a11a1a1a111",
      name: "capture2",
      url_match: "https://",
      capture_body: {
        id: {
          key: {
            match_expression: null,
            match_type: "manual",
            matched_value: "id",
          },
          value: {
            match_expression: "id2",
            match_type: "id",
            matched_value: "Go",
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
            matched_value: "Is great",
          },
        },
      },
    },
  },
};
