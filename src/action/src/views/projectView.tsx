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
import { AppTableTemplate } from "../components/table/appTable";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  tableDataConverter,
  convertISOToDate,
} from "../../../shared/src/utils/helpers";

import { useNavigate, useParams } from "react-router";
import ToastContext from "../context/Toast";
import { AppDropdown } from "../../../shared/src/components/dropdownSelector/AppDropdown";
import useContent from "../../../shared/src/hooks/useContent";

export const ProjectView: React.FC = () => {
  // Project id passed via url param
  const params = useParams();
  const userContentEvent = useContent();

  // Set local version of project details
  const [projectDetails, setProjectDetails] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    userContentEvent
      ?.emit("search", {
        type: "project",
        term: params.projectId,
      })
      .then((results: Array<ProjectGroup>) => {
        if (results.length === 1) {
          setProjectDetails(results[0]);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, [isLoaded]);

  return (
    <>
      <PopupTemplate
        contentComponent={
          <ContentComponent
            projectDetails={projectDetails}
            setProjectDetails={setProjectDetails}
            setIsLoaded={setIsLoaded}
            isLoaded={isLoaded}
          />
        }
        secondaryActions={<SecondaryActions projectDetails={projectDetails} />}
        primaryAction={<PrimaryAction />}
        backButtonEnabled={true}
      />
    </>
  );
};

const ContentComponent = ({ projectDetails, setProjectDetails, setIsLoaded, isLoaded }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFocus = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Input value
  const handleChangeText = (e) => {
    setProjectDetails((prev: ProjectGroup) => {
      return {
        ...prev,
        name: e.target.value,
      };
    });
  };

  /**
   * Convert capture details to form usable by table template, i.e. table data type
   */
  const projectDetailsTable = useMemo(() => {
    if (!projectDetails.captures) return null;
    return tableDataConverter(
      "captureList",
      Object.values(projectDetails.captures)
    );
  }, [projectDetails, isLoaded]);

  return (
    <>
      <div className={styles.project_info_container}>
        <div className={styles.project_name_container}>
          <h3>
            Project:
            <input
              ref={inputRef}
              type="text"
              value={projectDetails.name}
              className={styles.input_field}
              onChange={handleChangeText}
            />
          </h3>
          <EditButton
            height={20}
            width={20}
            strokeColor="black"
            pathFill="none"
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
          resetTableData={setIsLoaded}
          options={{
            enableEdit: true,
            enableDelete: true,
            enableSet: false,
            enableInLineEdit: false,
            dataType: "capture",
            ownerId: projectDetails.id,
          }}
        />
      </div>
    </>
  );
};

const SecondaryActions = ({ projectDetails }) => {
  const [toastState, setToastState] = useContext(ToastContext);
  const userContentEvents = useContent();
  const navigate = useNavigate();
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
            userContentEvents
              ?.emit("delete", {
                method: "delete",
                type: "project",
                data: projectDetails.id,
              })
              .then((be: BackendResponse) => {
                if (be.data.success) {
                  setToastState({
                    open: true,
                    timer: 1000,
                    text: <p>Deleted project successfully</p>,
                  });
                } else {
                  throw be;
                }
                navigate(-1);
              })
              .catch((e) => {
                setToastState({
                  open: true,
                  timer: 1000,
                  text: <p>Error: failed to delete project.</p>,
                });
              });
          }}
        >
          Yes
        </AppButtonTemplate>,
      ],
    }));
  }, [projectDetails]);

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
            setToastState(() => ({
              open: false,
            }));
          }}
        >
          Back
        </AppButtonTemplate>,
        <AppDropdown
          options={["json"]}
          data={projectDetails}
          exportButton={true}
          set="json"
        />,
      ],
    }));
  }, [projectDetails]);

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
            userContentEvents
              ?.emit("update", {
                method: "update",
                type: "project",
                data: projectDetails,
              })
              .then((be: BackendResponse) => {
                if (be.data.success) {
                  setToastState({
                    open: true,
                    timer: 1000,
                    text: <p>Updated project successfully</p>,
                  });
                } else {
                  throw be;
                }
              })
              .catch((e) => {
                setToastState({
                  open: true,
                  timer: 1000,
                  text: <p>Error: failed to update project details</p>,
                });
              });
          }}
        >
          Yes
        </AppButtonTemplate>,
      ],
    });
  }, [projectDetails]);

  return (
    <div className={styles.button_container}>
      <AppButtonTemplate
        textStyle={{
          color: "#fb3640ff",
        }}
        onClick={handleDeleteProject}
      >
        Delete
      </AppButtonTemplate>
      <AppButtonTemplate
        onClick={handleExportProject}
      >
        Export
      </AppButtonTemplate>
      <AppButtonTemplate
        textStyle={{
          color: "#006400",
        }}
        onClick={handleSaveProject}
      >
        Save
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
        pathFill="none"
        strokeColor="black"
        onClick={() => {
          navigate("/action/index.html");
        }}
        title="Home"
      />
    </>
  );
};
