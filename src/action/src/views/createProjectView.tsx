/**
 * Create a project
 */

import * as styles from "./createProjectView.module.css";
import { PopupTemplate } from "../components/popup_template";
import { HomeButton } from "../../../shared/src/assets/icons/appIcons";
import { AppButtonTemplate } from "../../../shared/src/components/buttons/appButton";
import { useNavigate } from "react-router";
import { useCallback, useContext, useState } from "react";
import ToastContext from "../context/Toast";
import useContent from "../../../shared/src/hooks/useContent";

export const CreateProject = () => {
  const [projectName, setProjectName] = useState("");
  return (
    <>
      <PopupTemplate
        contentComponent={<ContentComponent onChange={setProjectName} />}
        secondaryActions={<SecondaryActions projectName={projectName} />}
        primaryAction={<PrimaryAction />}
        backButtonEnabled={true}
      />
    </>
  );
};

const ContentComponent = ({ onChange }) => {
  return (
    <div className={styles.form_container}>
      <h3>Project Name</h3>
      <input
        type="text"
        className={styles.project_name_input}
        placeholder="Enter project name here..."
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
    </div>
  );
};

const SecondaryActions = ({ projectName }) => {
  const [toastState, setToastState] = useContext(ToastContext);
  const navigate = useNavigate();
  const userContentEvents = useContent();

  const handleCreateProject = useCallback(() => {
    if (projectName.length < 4) return;
    setToastState({
      open: true,
      text: <p>Do you want to create the project {projectName}?</p>,
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
            const createProject: CRUDDataOptions = {
              type: "project",
              method: "create",
              data: {
                name: projectName,
                last_edited: "",
                date_created: "",
                id: "",
                captures: {},
              },
            };

            userContentEvents
              ?.emit("create", createProject)
              .then((res: BackendResponse) => {
                if (res.data.success) {
                  setToastState({
                    open: true,
                    text: <p>Successfully created project: {projectName}</p>,
                    timer: 1000,
                    timerCallback: () => {
                      navigate("/action/index.html");
                    },
                  });
                } else {
                  throw new Error(res);
                }
              })
              .catch((e) => {
                const error = e as BackendResponse;

                if (error.data.message.includes("already exists")) {
                  setToastState({
                    open: true,
                    text: <p>Error: {error.data.message}</p>,
                    timer: 1000,
                  });
                } else if (!error.data.success) {
                  setToastState({
                    open: true,
                    text: <p>Error: could not create project</p>,
                    timer: 1000,
                  });
                }
              });
          }}
        >
          {" "}
          Yes{" "}
        </AppButtonTemplate>,
      ],
    });
  }, [toastState, projectName]);

  return (
    <div className={styles.button_container}>
      <AppButtonTemplate
        textStyle={{
          color: "#006400",
        }}
        onClick={handleCreateProject}
      >
        Create
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
        strokeColor="black"
        pathFill="none"
        onClick={() => {
          navigate("/action/index.html");
        }}
        title="Home"
      />
    </>
  );
};
