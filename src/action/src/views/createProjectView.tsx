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

export const CreateProject = () => {

  const [projectName, setProjectName] = useState('')
  return (
    <>
      <PopupTemplate
        contentComponent={<ContentComponent onChange={setProjectName}/>}
        secondaryActions={<SecondaryActions projectName={projectName} />}
        primaryAction={<PrimaryAction />}
        backButtonEnabled={true}
      />
    </>
  );
};

const ContentComponent = ({
  onChange
}) => {


  return (
    <div className={styles.form_container}>
      <h3>Project Name</h3>
      <input
        type="text"
        className={styles.project_name_input}
        placeholder="Enter project name here..."
        onChange={(e)=>{
          onChange(e.target.value)
        }}
      />
    </div>
  );
};

const SecondaryActions = ({
  projectName
}) => {
  const [toastState, setToastState] = useContext(ToastContext)
  const handleCreateProject = useCallback(()=>{
    if(projectName.length < 4) return
    setToastState(prevState =>({
      ...prevState,
      open: true,
      text: <p>Do you want to create the project {projectName}?</p>,
      buttons: [
        <AppButtonTemplate
          onClick={()=>{
            setToastState(prevState=>({
              open:false
            }))
          }}
        
        > No </AppButtonTemplate>,
        <AppButtonTemplate> Yes </AppButtonTemplate>
      ]
    }))
  }, [toastState, projectName])
  
  return (
    <div className={styles.button_container}>
      <AppButtonTemplate
        textStyle={{
          fontSize: 14,
          color: "#006400",
        }}
        onClick={handleCreateProject}
      >
        Create Project
      </AppButtonTemplate>
    </div>
  );
};

const PrimaryAction = () => {
  const navigate = useNavigate()
  return (
    <>
      <HomeButton height={30} width={30}  onClick={()=>{
          navigate('/')
        }} />
    </>
  );
};
