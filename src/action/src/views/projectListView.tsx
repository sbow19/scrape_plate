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
  const projectList = projectListn
  return (
    <>
      <PopupTemplate
        contentComponent={
          <ContentComponent
            projectList={projectList}
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
            Project List            
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
            dataType: "project"
          }}
        />
      </div>
    </>
  );
};

const SecondaryActions = () => {
  const navigate = useNavigate()
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

const projectListn: {
  [key: string]: ProjectGroup;
} =  {
    "a11aa111-11aa-1111-a111-1a11a1a1a111": {
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
                matched_value: "location"
              },
              value: {
               match_expression: "id2",
                match_type: "id",
                matched_value: "Hamburg"
              }
             
            },
            age: {
              key: {
               match_expression: null,
                match_type: "manual", 
                matched_value: "age"
              }, 
              value: {
               match_expression: "id4",
                match_type: "id", 
                matched_value: "22"
              }
              
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
              key:{
               match_expression: null, 
                match_type: "manual",
                matched_value: "id"
              },
              value: {
               match_expression: "id2",
                match_type: "id",
                matched_value: "Go"
              }
            },
            name: {
              key:{
               match_expression: "id3", 
                match_type: "id",
                matched_value: "name"
              },
              value: {
               match_expression: "id4",
                match_type: "id",
                matched_value: "Is great"
              }
            },
          },
        },
      },
    },
    "a11aa111-11aa-1111-a111-1a11a1a1a112": {
      name: "project2",
      date_created: "2024-01-10T14:30:00",
      last_edited: "2024-03-13T14:30:00",
      id: "a11aa111-11aa-1111-a111-1a11a1a1a112",
      captures: {
        "c11aa111-11aa-1111-a111-1a11a1a1a113": {
          id: "c11aa111-11aa-1111-a111-1a11a1a1a113",
          date_created: "2025-01-11T14:30:00",
          last_edited: "2025-01-12T14:30:00",
          project_id: "a11aa111-11aa-1111-a111-1a11a1a1a112",
          schema_id: "s11aa111-11aa-1111-a111-1a11a1a1a111",
          url_match: "https://",
          name: "capture1",
          capture_body: {
            location: {
              key: {
               match_expression: "id1",
                match_type: "id",
                matched_value: "location"
              },
              value: {
               match_expression: "id2",
                match_type: "id",
                matched_value: "United Kingdom"
              }
             
            },
            age: {
              key: {
               match_expression: null,
                match_type: "manual", 
                matched_value: "age"
              }, 
              value: {
               match_expression: "id4",
                match_type: "id", 
                matched_value: "74"
              }
              
            },
          },
        },
        "c11aa111-11aa-1111-a111-1a11a1a1a114": {
          id: "c11aa111-11aa-1111-a111-1a11a1a1a114",
          date_created: "2025-01-11T14:30:00",
          last_edited: "2025-01-12T14:30:00",
          project_id: "a11aa111-11aa-1111-a111-1a11a1a1a112",
          schema_id: "s11aa111-11aa-1111-a111-1a11a1a1a112",
          name: "capture2",
          url_match: "https://",
          capture_body: {
            id: {
              key:{
               match_expression: null, 
                match_type: "manual",
                matched_value: "id"
              },
              value: {
               match_expression: "id2",
                match_type: "id",
                matched_value: "123456789"
              }
            },
            name: {
              key:{
               match_expression: "id3", 
                match_type: "id",
                matched_value: "name"
              },
              value: {
               match_expression: "id4",
                match_type: "id",
                matched_value: "Nicholas Watsowky"
              }
            },
          },
        },
      },
    },
  };
