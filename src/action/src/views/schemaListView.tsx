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
  const schemaList = schemaListn
  return (
    <>
      <PopupTemplate
        contentComponent={
          <ContentComponent
            schemaList={schemaList}
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
            enableEdit: false,
            enableInLineEdit: false,
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

const schemaListn: {
  [key: string]: Schema;
} = {
  "s11aa111-11aa-1111-a111-1a11a1a1a112": {
    id: "s11aa111-11aa-1111-a111-1a11a1a1a112",
    name: "schema2",
    url_match: "https://www.google.com",
    schema: {
      id: {
        key: {
          match_expression: null,
          match_type: "manual",
          matched_value: "id",
        },
        value: {
          match_expression: "id2",
          match_type: "id",
          matched_value: null,
        },
      },
      name: {
        key: {
          match_expression: "id3",
          match_type: "id",
          matched_value: "name",
        },
        value: {
          match_expression: "id4",
          match_type: "id",
          matched_value: null,
        },
      },
    },
  },
  "s11aa111-11aa-1111-a111-1a11a1a1a111": {
    id: "s11aa111-11aa-1111-a111-1a11a1a1a111",
    name: "schema1",
    url_match: "https://www.amazon.com",
    schema: {
      location: {
        key: {
          match_expression: "id1",
          match_type: "id",
          matched_value: "location",
        },
        value: {
          match_expression: "id2",
          match_type: "id",
          matched_value: null,
        },
      },
      age: {
        key: {
          match_expression: null,
          match_type: "manual",
          matched_value: "age",
        },
        value: {
          match_expression: "id4",
          match_type: "id",
          matched_value: null,
        },
      },
    },
  },
};
