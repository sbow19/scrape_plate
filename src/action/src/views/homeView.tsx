/**
 * Main popup landing page
 */
import { PopupTemplate } from "../components/popup_template";
import { ScrapeButton } from "../../../shared/src/assets/icons/appIcons";
import { EditButton } from "../../../shared/src/assets/icons/appIcons";
import { ButtonSlider } from "../../../shared/src/components/slider/appSlider";
import { AppTableTemplate } from "../../../shared/src/components/table/appTable";

import * as styles from "./homeView.module.css";
import { useContext, useMemo } from "react";
import { tableDataConverter } from "../../../shared/src/utils/helpers";
import { AppButtonTemplate } from "../../../shared/src/components/buttons/appButton";
import { useNavigate } from "react-router";
import ToastContext from "../context/Toast";

export const HomeView = () => {
  /*IMPLEMENT: Fetch schema matches here */
  return (
    <>
      <PopupTemplate
        contentComponent={<ContentComponent matchingSchemas={[]} currentProject={{}}/>}
        secondaryActions={<SecondaryActions />}
        primaryAction={<PrimaryAction matchingSchemas={[]} />}
        backButtonEnabled={false}
      />
    </>
  );
};

const ContentComponent = ({ matchingSchemas, currentProject }) => {
  const matchingDetailsTable: TableData | null = useMemo(() => {
    const cleanedData =
      matchingSchemas.length > 0
        ? tableDataConverter("schemaMatchList", matchingSchemas)
        : null;

    return cleanedData;
  }, [matchingSchemas]);

  /* Navigation */
  const navigate = useNavigate();

  return (
    <>
      <div className={styles.home_content_wrapper}>
        <div className={styles.current_project_container}>
          <h3 className={styles.current_project_title}>Current Project</h3>
          <div className={styles.project_name_wrapper}>
            {currentProject ? (
              <>
                <p>{/* Current project name */} {currentProject.name} </p>
                <EditButton
                  height={20}
                  width={20}
                  title="Change Project"
                  onClick={() => {
                    navigate(`/project/${currentProject.id}`);
                  }}
                />
              </>
            ) : (
              <>No current project</>
            )}
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
                  dataType: "schema",
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
  const navigate = useNavigate();
  const dummySelectorData: Array<[string, Array<React.ReactNode>]> = [
    [
      "Projects",
      [
        <AppButtonTemplate
          onClick={() => {
            navigate("/project");
          }}
        >
          View
        </AppButtonTemplate>,
        <AppButtonTemplate
          onClick={() => {
            navigate("/project/create");
          }}
        >
          Create
        </AppButtonTemplate>,
      ],
    ],
    [
      "Schemas",
      [
        <AppButtonTemplate
          onClick={() => {
            navigate("/schema");
          }}
        >
          View
        </AppButtonTemplate>,
        <AppButtonTemplate>Create</AppButtonTemplate>,
      ],
    ],
  ];
  return (
    <>
      <ButtonSlider selectorData={dummySelectorData}></ButtonSlider>
    </>
  );
};

const PrimaryAction = ({ matchingSchemas }) => {
  const [, setToastState] = useContext(ToastContext);
  return (
    <>
      <ScrapeButton
        height={30}
        width={30}
        title="Scrape"
        onClick={() => {
          if (matchingSchemas.length > 0) {
            /* Execute scrape logic */
          } else {
            setToastState({
              open: true,
              text: <p> No schema matches this page's url.</p>,
              buttons: [],
              timer: 1250,
            });
          }
        }}
      />
    </>
  );
};


