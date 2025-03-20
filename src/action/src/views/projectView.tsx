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
import { useCallback, useMemo, useRef, useState } from "react";
import { tableDataConverter, convertISOToDate } from "../../../shared/src/utils/helpers";

import { useParams } from "react-router";

export const ProjectView: React.FC<ProjectViewProps> = () => {
  
  /* GET PROJECT DETAILS */
  const params = useParams()
  console.log(params)

  return (
    <>
      <PopupTemplate
        contentComponent={<ContentComponent projectDetails={projectDetailsn} />}
        secondaryActions={<SecondaryActions />}
        primaryAction={<PrimaryAction />}
        backButtonEnabled={true}
      />
    </>
  );
};

const ContentComponent = ({ projectDetails }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFocus = useCallback(()=>{
    if(inputRef.current){
      inputRef.current.readOnly = false
      inputRef.current.focus()
    }
  }, [])
  const handleBlur = useCallback(()=>{
    if(inputRef.current){
      inputRef.current.readOnly = true
    }
  }, [])

  // Input value
  const [currentName, setCurrentName] = useState(projectDetails.name)
  const handleChangeText = useCallback((e)=>{
    setCurrentName(e.value)
  }, [])


  /**
   * Convert capture details to form usable by table template, i.e. table data type
   */
  const projectDetailsTable = useMemo(()=>{
    return tableDataConverter('captureList', Object.values(projectDetails.captures))
  }, [projectDetails])

  
  return (
    <>
      <div className={styles.project_info_container}>
        <div className={styles.project_name_container}>
          <h3>
            Project:{" "}
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
          <EditButton height={20} width={20} onClick={handleFocus} title='Edit Name'/>
        </div>
        <div className={styles.created_at}>
          <b>Created At:</b> {convertISOToDate(projectDetails.date_created)}
        </div>
        <div className={styles.last_edited}>
          <b>Last Edited:</b> {convertISOToDate(projectDetails.last_edited)}
        </div>
        <div className={styles.table_title}>Captures</div>
      </div>
      <div className={styles.table_container}>
        <AppTableTemplate 
          tableData={projectDetailsTable}
          options={{
            enableEdit: true,
            enableDelete: true
          }}
        />
      </div>
    </>
  );
};

const SecondaryActions = () => {
  return (
    <div className={styles.button_container}>
      <AppButtonTemplate
        textStyle={{
          fontSize: 14,
          color: "#fb3640ff",
        }}
      >
        Delete
      </AppButtonTemplate>
      <AppButtonTemplate
        textStyle={{
          fontSize: 14,
        }}
      >
        Export
      </AppButtonTemplate>
      <AppButtonTemplate
        textStyle={{
          fontSize: 14,
          color: "#006400",
        }}
      >
        Save Changes
      </AppButtonTemplate>
    </div>
  );
};

const PrimaryAction = () => {
  return (
    <>
      <HomeButton height={30} width={30} />
    </>
  );
};

const projectDetailsn: ProjectGroup ={
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
};
