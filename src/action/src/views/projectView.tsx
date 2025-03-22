/**
 * Individual project view
 */
import { PopupTemplate } from "../components/popup_template";
import {
  HomeButton,
  EditButton,
} from "../../../shared/src/assets/icons/appIcons";
import { AppButtonTemplate } from "../../../shared/src/components/buttons/appButton";
import * as styles from "./projectView.module.css";
import { AppTableTemplate } from "../../../shared/src/components/table/appTable";
import { useCallback, useContext, useMemo, useRef, useState } from "react";
import {
  tableDataConverter,
  convertISOToDate,
} from "../../../shared/src/utils/helpers";

import { useNavigate, useParams } from "react-router";
import ToastContext from "../context/Toast";
import { AppDropdown } from "../../../shared/src/components/dropdownSelector/AppDropdown";

export const ProjectView: React.FC = () => {
  /* GET PROJECT DETAILS */
  const params = useParams();

  return (
    <>
      <PopupTemplate
        contentComponent={<ContentComponent projectDetails={{}} />}
        secondaryActions={<SecondaryActions projectDetails={{}} />}
        primaryAction={<PrimaryAction />}
        backButtonEnabled={true}
      />
    </>
  );
};

const ContentComponent = ({ projectDetails }) => {
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
  const [currentName, setCurrentName] = useState(projectDetails.name);
  const handleChangeText = useCallback((e) => {
    setCurrentName(e.value);
  }, []);

  /**
   * Convert capture details to form usable by table template, i.e. table data type
   */
  const projectDetailsTable = useMemo(() => {
    if (!projectDetails.captures) return null;
    return tableDataConverter(
      "captureList",
      Object.values(projectDetails.captures)
    );
  }, [projectDetails]);

  return (
    <>
      <div className={styles.project_info_container}>
        <div className={styles.project_name_container}>
          <h3>
            Project:
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
          <b>Created At:</b>
          {convertISOToDate(projectDetails?.date_created ?? null)}
        </div>
        <div className={styles.last_edited}>
          <b>Last Edited:</b>
          {convertISOToDate(projectDetails?.last_edited ?? null)}
        </div>
        <div className={styles.table_title}>Captures</div>
      </div>
      <div className={styles.table_container}>
        <AppTableTemplate
          tableData={projectDetailsTable}
          options={{
            enableEdit: true,
            enableDelete: true,
            enableInLineEdit: false,
            dataType: "capture",
          }}
        />
      </div>
    </>
  );
};

const SecondaryActions = ({ projectDetails }) => {
  const [toastState, setToastState] = useContext(ToastContext);
  /**
   * Delete project toast trigger handler
   */
  const handleDeleteProject = useCallback(() => {
    setToastState((prevState) => ({
      ...prevState,
      open: true,
      text: <p> Are you sure you want to delete {projectDetails.name}?</p>, // Usually name of entry
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
            /* IMPLEMENT: trigger delete */
            setToastState({
              open: false,
            });
          }}
        >
          
          Yes
        </AppButtonTemplate>,
      ],
    }));
  }, [toastState]);

  /**
   * Export project toast trigger handler
   */
  const handleExportProject = useCallback(() => {
    setToastState((prevState) => ({
      ...prevState,
      open: true,
      text: <p>How do you want to export {projectDetails.name}?</p>,
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
        <AppDropdown options={["json", "excel"]} data={projectDetails} />,
      ],
    }));
  }, [toastState]);

  /**
   * Save project toast trigger handler
   */
  const handleSaveProject = useCallback(() => {
    setToastState({
      open: true,
      text: <p> Save changes to {projectDetails.name}?</p>,
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
            /* IMPLEMENT: trigger delete */
            setToastState({
              open: false,
            });
          }}
        >
          
          Yes
        </AppButtonTemplate>,
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
        onClick={handleDeleteProject}
      >
        Delete
      </AppButtonTemplate>
      <AppButtonTemplate
        textStyle={{
          fontSize: 14,
        }}
        onClick={handleExportProject}
      >
        Export
      </AppButtonTemplate>
      <AppButtonTemplate
        textStyle={{
          fontSize: 14,
          color: "#006400",
        }}
        onClick={handleSaveProject}
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
      <HomeButton
        height={30}
        width={30}
        onClick={() => {
          navigate("/");
        }}
        title='Home'
      />
    </>
  );
};
