/**
 * Schema list
 */
import { PopupTemplate } from "../components/popup_template";
import { AppButtonTemplate } from "../../../shared/src/components/buttons/appButton";
import { AppTableTemplate } from "../components/table/appTable";
import { useContext, useEffect, useMemo, useState } from "react";
import * as styles from "./schemaListView.module.css";
import { HomeButton } from "../../../shared/src/assets/icons/appIcons";
import { tableDataConverter } from "../../../shared/src/utils/helpers";
import { useNavigate } from "react-router";
import { openSidePanel } from "../utils/chromeMessaging";
import TabContext from "../context/Tab";
import useContent from "../../../shared/src/hooks/useContent";

export const SchemaListView = () => {
  /*IMPLEMENT: Get all schemas from store */
    const [schemaList, setSchemaList] = useState({})
    const userContentEvents = useContent()
    const [isLoaded, setIsLoaded] = useState(false)
  
    useEffect(()=>{
        userContentEvents?.emit('getAllOf', 'schemas')
        .then((newSchemaList)=>{
          setSchemaList(newSchemaList)
        })
        .catch((e)=>{
          console.log(e)
        })
    }, [isLoaded])
  return (
    <>
      <PopupTemplate
        contentComponent={<ContentComponent schemaList={schemaList} setIsLoaded={setIsLoaded} isLoaded={isLoaded}/>}
        secondaryActions={<SecondaryActions />}
        primaryAction={<PrimaryAction />}
        backButtonEnabled={true}
      />
    </>
  );
};

const ContentComponent = ({ schemaList, isLoaded, setIsLoaded }) => {
  /**
   * Convert capture details to form usable by table template, i.e. table data type
   */

  const schemaDetailsTable: TableData | null = useMemo(() => {
    return tableDataConverter("schemaList", Object.values(schemaList));
  }, [schemaList, isLoaded]);

  return (
    <>
      <div className={styles.project_info_container}>
        <div className={styles.project_name_container}>
          <h3>Schema List</h3>
        </div>
      </div>
      <div className={styles.table_container}>
        <AppTableTemplate
          tableData={schemaDetailsTable}
          resetTableData={setIsLoaded}
          options={{
            enableDelete: true,
            enableEdit: true,
            enableSet: false,
            enableInLineEdit: false,
            dataType: "schema",
          }}
        />
      </div>
    </>
  );
};

const SecondaryActions = () => {
  const tab = useContext(TabContext);

  return (
    <div className={styles.button_container}>
      <AppButtonTemplate
        textStyle={{
          fontSize: 14,
          color: "black",
        }}
        onClick={()=>{
          openSidePanel(tab, "create_schema",   {
            name: "",
            id: "",
            url_match: tab?.url ?? "",
            schema: {},
          });
        }}
      >
        Create Schema
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
