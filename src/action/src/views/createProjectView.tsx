/**
 * Create a project
 */

import * as styles from "./createProjectView.module.css";
import { PopupTemplate } from "../components/popup_template";
import { HomeButton } from "../../../shared/src/assets/icons/appIcons";
import { AppButtonTemplate } from "../../../shared/src/components/buttons/appButton";
import { useNavigate } from "react-router";

export const CreateProject = () => {
  return (
    <>
      <PopupTemplate
        contentComponent={<ContentComponent />}
        secondaryActions={<SecondaryActions />}
        primaryAction={<PrimaryAction />}
        backButtonEnabled={true}
      />
    </>
  );
};

const ContentComponent = () => {
  return (
    <div className={styles.form_container}>
      <h3>Project Name</h3>
      <input
        type="text"
        className={styles.project_name_input}
        placeholder="Enter project name here..."
      />
    </div>
  );
};

const SecondaryActions = () => {
  return (
    <div className={styles.button_container}>
      <AppButtonTemplate
        textStyle={{
          fontSize: 14,
          color: "#006400",
        }}
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
