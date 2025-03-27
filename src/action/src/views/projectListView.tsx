/**
 * project list
 */
import { PopupTemplate } from "../components/popup_template";
import { AppButtonTemplate } from "../../../shared/src/components/buttons/appButton";
import { AppTableTemplate } from "../components/table/appTable";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as styles from "./projectListView.module.css";
import { HomeButton } from "../../../shared/src/assets/icons/appIcons";
import { tableDataConverter } from "../../../shared/src/utils/helpers";

import { useNavigate } from "react-router";
import useContent from "../../../shared/src/hooks/useContent";
import ToastContext from "../context/Toast";
import { AppDropdown } from "../../../shared/src/components/dropdownSelector/AppDropdown";

export const ProjectListView = () => {
  /**
   * Convert capture details to form usable by table template, i.e. table data type
   */

  const [projectList, setProjectList] = useState({})
  const userContentEvents = useContent()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(()=>{
      userContentEvents?.emit('getAllOf', 'projects')
      .then((newProjectList)=>{
        setProjectList(newProjectList)
      })
      .catch((e)=>{
        console.log(e)
      })
  }, [isLoaded])

  return (
    <>
      <PopupTemplate
        contentComponent={<ContentComponent setIsLoaded={setIsLoaded} isLoaded={isLoaded} projectList={projectList}/>}
        secondaryActions={<SecondaryActions projectList={projectList}/>}
        primaryAction={<PrimaryAction />}
        backButtonEnabled={true}
      />
    </>
  );
};

const ContentComponent = ({projectList, isLoaded, setIsLoaded}) => {
  

  const projectDetailsTable: TableData | null = useMemo(() => {
    return tableDataConverter("projectList", Object.values(projectList));
  }, [projectList, isLoaded]);

  return (
    <>
      <div className={styles.project_info_container}>
        <div className={styles.project_name_container}>
          <h3>Projects</h3>
        </div>
      </div>
      <div className={styles.table_container}>
        <AppTableTemplate
          tableData={projectDetailsTable}
          resetTableData={setIsLoaded}
          options={{
            enableDelete: true,
            enableEdit: true,
            enableSet: true,        // Set current project
            enableInLineEdit: false,
            dataType: "project",
          }}
        />
        
      </div>
    </>
  );
};

const SecondaryActions = ({projectList}) => {
  const navigate = useNavigate();
  const [toastState, setToastState] = useContext(ToastContext);


  /**
     * Export project toast trigger handler
     */
    const handleExportProject = useCallback(() => {
      setToastState((prevState) => ({
        ...prevState,
        open: true,
        text: <p>How do you want to export all projects?</p>,
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
          <AppDropdown
            options={["json"]} 
            data={projectList}
            exportButton={true}
            set='json'
          />,
        ],
      }));
    }, [projectList]);

  return (
    <div className={styles.button_container}>
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
          color: "black",
        }}
        onClick={() => {
          navigate("/project/create");
        }}
      >
        Create Project
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
      />
    </>
  );
};
