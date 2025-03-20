/**
 * Main popup landing page
 */
import { PopupTemplate } from "../components/popup_template";
import { ScrapeButton } from "../../../shared/src/assets/icons/appIcons";
import { EditButton } from "../../../shared/src/assets/icons/appIcons";
import { ButtonSlider } from "../../../shared/src/components/slider/appSlider";
import { AppTableTemplate } from "../../../shared/src/components/table/appTable";

import * as styles from "./homeView.module.css";
import { useMemo } from "react";
import { tableDataConverter } from "../../../shared/src/utils/helpers";
import { AppButtonTemplate } from "../../../shared/src/components/buttons/appButton";
import { useNavigate } from "react-router";

export const HomeView = () => {
  /*IMPLEMENT: Fetch schema matches here */
  const matchingSchemasn = matchingSchemas;
  return (
    <>
      <PopupTemplate
        contentComponent={
          <ContentComponent matchingSchemas={matchingSchemasn} />
        }
        secondaryActions={<SecondaryActions />}
        primaryAction={<PrimaryAction />}
        backButtonEnabled={false}
      />
    </>
  );
};

const ContentComponent = ({ matchingSchemas }) => {
  const matchingDetailsTable: TableData | null = useMemo(() => {
    const cleanedData =
      matchingSchemas.length > 0
        ? tableDataConverter("schemaMatchList", Object.values(matchingSchemas))
        : null;
      
        return cleanedData
  }, [matchingSchemas]);

  return (
    <>
      <div className={styles.home_content_wrapper}>
        <div className={styles.current_project_container}>
          <h3 className={styles.current_project_title}>Current Project</h3>
          <div className={styles.project_name_wrapper}>
            <p>{/* Current project name */} Project name </p>
            <EditButton height={20} width={20} title="Change Project" />
          </div>
        </div>
        <div className={styles.matching_schemas_container}>
          <h3 className={styles.matching_schemas_title}>Matching Schemas</h3>

          {/* If no matching schemas, then display default */}
          <div className={styles.matching_schema_content_container}>
            {matchingSchemas.length > 0 ? (
              <AppTableTemplate
                tableData={matchingDetailsTable}
                options={{
                  enableDelete: false,
                  enableEdit: true,
                  enableInLineEdit: false,
                }}
              ></AppTableTemplate>
            ) : (
              <p> No matching schemas</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const SecondaryActions = () => {
  const navigate = useNavigate()
  const dummySelectorData: Array<any> = [
    [
        "Projects",
        [
            <AppButtonTemplate
              onClick={()=>{
                navigate('/projects')
              }}
            >View</AppButtonTemplate>,
            <AppButtonTemplate
            onClick={()=>{
              navigate('/projects/create')
            }}
            >Create</AppButtonTemplate>
        ]
    ],
    [
        "Schemas",
        [
            <AppButtonTemplate
            onClick={()=>{
              navigate('/schemas')
            }}
            >View</AppButtonTemplate>,
            <AppButtonTemplate>Create</AppButtonTemplate>
        ]
    ]
  ]
  return (
    <>
      <ButtonSlider
        selectorData={dummySelectorData}
      ></ButtonSlider>
    </>
  );
};



const PrimaryAction = () => {
  return (
    <>
      <ScrapeButton height={30} width={30} title="Scrape" />
    </>
  );
};

const matchingSchemas: Array<Schema> = [
  {
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
  {
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
];
