/**
 * Schema list
 */
import { PopupTemplate } from "../components/popup_template";
import { AppButtonTemplate } from "../../../shared/src/components/buttons/appButton";
import { AppTableTemplate } from "../../../shared/src/components/table/appTable";
import { useMemo } from "react";
import * as styles from "./schemaListView.module.css";
import {
  HomeButton,
} from "../../../shared/src/assets/icons/appIcons";
import {
  tableDataConverter,
} from "../../../shared/src/utils/helpers";
import { useNavigate } from "react-router";

export const SchemaListView = () => {
  /*IMPLEMENT: Get all schemas from store */
  return (
    <>
      <PopupTemplate
        contentComponent={
          <ContentComponent
            schemaList={{}}
          />
        }
        secondaryActions={<SecondaryActions />}
        primaryAction={<PrimaryAction />}
        backButtonEnabled={true}
      />
    </>
  );
};

const ContentComponent = ({ schemaList }) => {


  /**
   * Convert capture details to form usable by table template, i.e. table data type
   */

  const schemaDetailsTable: TableData = useMemo(() => {
    return tableDataConverter(
      "schemaList",
      Object.values(schemaList)
    );
  }, [schemaList]);

  return (
    <>
      <div className={styles.project_info_container}>
        <div className={styles.project_name_container}>
          <h3>
            Schema List            
          </h3>
          
        </div>
       
      </div>
      <div className={styles.table_container}>
        <AppTableTemplate
          tableData={schemaDetailsTable}
          options={{
            enableDelete: true,
            enableEdit: true,
            enableInLineEdit: false,
            dataType: 'schemas'
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
          color: "black",
        }}
      >
        Create Schema
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
        }}/>
    </>
  );
};
