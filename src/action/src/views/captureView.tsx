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
            projectDetails={{}}
            captureId={''}
          />
        }
        secondaryActions={
          <SecondaryActions
            projectDetails={{}}
            captureId={''}
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

  const captureDetailsTable = useMemo(() => {
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
            dataType: 'other'
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
    setToastState({
      open: true,
      text:<p> Save changes to capture?</p>,
      buttons: [
        <AppButtonTemplate
          onClick={()=>{
            setToastState({
              open: false
            })
          }}
        > No </AppButtonTemplate>,
        <AppButtonTemplate
        onClick={()=>{
          /* IMPLEMENT: trigger delete */
          setToastState({
            open: false
          })

        }}
        > Yes </AppButtonTemplate>,
      ]
    });
  }, [setToastState]);

  /**
   * Export Capture toast trigger handler
   */
  const handleDeleteCapture = useCallback(() => {
    setToastState({

      open: true,
      text: (
        <p>
          
          Are you sure you want to delete
          {projectDetails.captures[captureId].name}?
        </p>
      ), // Usually name of entry
      buttons: [
        <AppButtonTemplate
          onClick={() => {
            setToastState({
              open: false,
            });
          }}
        >
          {" "}
          No{" "}
        </AppButtonTemplate>,
        <AppButtonTemplate
          onClick={() => {
            /* IMPLEMENT: trigger delete */
            setToastState({
              open: false,
            });
          }}
        >
          {" "}
          Yes{" "}
        </AppButtonTemplate>,
      ],
    });
  }, [setToastState]);

  /**
   * Save Capture toast trigger handler
   */
  const handleExportCapture = useCallback(() => {
    setToastState({
      open: true,
      text: <p>How do you want to export {projectDetails.captures[captureId].name}?</p>,
      buttons: [
        <AppButtonTemplate
          onClick={() => {
            setToastState({
              open: false,
            });
          }}
        >
          Back
        </AppButtonTemplate>,
        <AppDropdown options={["json", "excel"]} data={projectDetails.captures[captureId]} />,
      ],
    });
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
      }} title="Home"/>
    </>
  );
};
