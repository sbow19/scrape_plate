/**
 * project list
 */
import { PopupTemplate } from "../components/popup_template";
import { AppButtonTemplate } from "../../../shared/src/components/buttons/appButton";
import { AppTableTemplate } from "../../../shared/src/components/table/appTable";
import { useMemo } from "react";
import * as styles from "./projectListView.module.css";
import {
  HomeButton,
} from "../../../shared/src/assets/icons/appIcons";
import {
  tableDataConverter,
} from "../../../shared/src/utils/helpers";

import { useNavigate } from "react-router";

export const ProjectListView = () => {
  /*IMPLEMENT: Get all schemas from store */
  
  return (
    <>
      <PopupTemplate
        contentComponent={
          <ContentComponent
            projectList={{}}
          />
        }
        secondaryActions={<SecondaryActions />}
        primaryAction={<PrimaryAction />}
        backButtonEnabled={true}
      />
    </>
  );
};

const ContentComponent = ({ projectList }) => {


  /**
   * Convert capture details to form usable by table template, i.e. table data type
   */

  const projectDetailsTable: TableData = useMemo(() => {
    return tableDataConverter(
      "projectList",
      Object.values(projectList)
    );
  }, [projectList]);

  return (
    <>
      <div className={styles.project_info_container}>
        <div className={styles.project_name_container}>
          <h3>
            Projects           
          </h3>
          
        </div>
       
      </div>
      <div className={styles.table_container}>
        <AppTableTemplate
          tableData={projectDetailsTable}
          options={{
            enableDelete: true,
            enableEdit: true,
            enableInLineEdit: false,
            dataType: "projects"
          }}
        />
      </div>
    </>
  );
};

const SecondaryActions = () => {
  const navigate = useNavigate();

  
  return (
    <div className={styles.button_container}>
      <AppButtonTemplate
        textStyle={{
          fontSize: 14,
          color: "black",
        }}
        onClick={()=>{
          navigate('/projects/create')
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
      <HomeButton 
        height={30} 
        width={30} 
        onClick={()=>{
          navigate('/')
        }}
      />
    </>
  );
};

