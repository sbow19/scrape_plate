/**
 * Main popup landing page
 */
import { PopupTemplate } from "../components/popup_template";
import { ScrapeButton } from "../../../shared/src/assets/icons/appIcons";
import { EditButton, AddButton } from "../../../shared/src/assets/icons/appIcons";
import { ButtonSlider } from "../../../shared/src/components/slider/appSlider";
import { AppTableTemplate } from "../components/table/appTable";

import * as styles from "./homeView.module.css";
import { useContext, useEffect, useMemo, useState } from "react";
import { tableDataConverter } from "../../../shared/src/utils/helpers";
import { AppButtonTemplate } from "../../../shared/src/components/buttons/appButton";
import { useNavigate } from "react-router";
import ToastContext from "../context/Toast";
import UserContent from "../../../shared/src/state/state";
import useContent from "../../../shared/src/hooks/useContent";
import { openSidePanel } from "../utils/chromeMessaging";
import TabContext from "../context/Tab";

export const HomeView = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  const userContentEvents = useContent();

  if (!userContentEvents) throw new Error("Failed to get user content model");

  const [matchingSchemas, setMatchingSchemas] = useState<Schema[]>([]);
  const [currentProject, setCurrentProject] = useState<ProjectGroup>({});

  const navigate = useNavigate();

  useEffect(() => {
    if (UserContent.hasLoaded) {
      // Fetch all user content
      userContentEvents
        ?.emit("getAllOf", "details")
        .then(async (v) => {
          if (!v.hasUsedOnce) {
            navigate("/welcome");
            return;
          }

          return userContentEvents.emit("search", {
            term: v.currentProject,
            type: "project",
          });
        })
        .then((results: ProjectGroup[]) => {
          if (results.length > 0) setCurrentProject(results[0]);

          return userContentEvents.emit("getMatchingSchemas", null);
        })
        .then((schemaArray: Array<Schema>) => {
          setMatchingSchemas(schemaArray);
        })
        .catch(() => {})
        .finally(() => {
          setIsLoaded(true);
          UserContent.hasLoaded = true;
        });
    } else {
      userContentEvents
        .emit("fetch", "")
        .then((userContentModel: UserContentModel) => {
          if (!userContentModel.details.hasUsedOnce) {
            navigate("/welcome");
            return;
          }

          const searchOptions: SearchOptions = {
            type: "project",
            term: userContentModel.details?.currentProject ?? "",
          };

          return userContentEvents.emit("search", searchOptions);
        })
        .then((results: ProjectGroup[]) => {
          if (results.length > 0) setCurrentProject(results[0]);

          return userContentEvents.emit("getMatchingSchemas", null);
        })
        .then((schemaArray: Array<Schema>) => {
          setMatchingSchemas(schemaArray);
        })
        .catch(() => {})
        .finally(() => {
          setIsLoaded(true);
          UserContent.hasLoaded = true;
        });
    }
  }, []);
  return (
    <>
      {isLoaded ? (
        <PopupTemplate
          contentComponent={
            <ContentComponent
              matchingSchemas={matchingSchemas}
              currentProject={currentProject}
            />
          }
          secondaryActions={<SecondaryActions />}
          primaryAction={<PrimaryAction matchingSchemas={matchingSchemas} />}
          backButtonEnabled={false}
        />
      ) : (
        <PopupTemplate
          contentComponent={<></>}
          secondaryActions={<SecondaryActions />}
          primaryAction={<PrimaryAction matchingSchemas={matchingSchemas} />}
          backButtonEnabled={false}
        />
      )}
    </>
  );
};

const ContentComponent = ({ matchingSchemas, currentProject }) => {
  const matchingDetailsTable: TableData | null = useMemo(() => {
    if (!matchingSchemas) return null;
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
            {currentProject.name ? (
              <>
                <p>
                  {/* Current project name */} {currentProject.name}{" "}
                </p>
                <AddButton
                  height={20}
                  width={20}
                  strokeColor="black"
                  pathFill="none"
                  title="Change Project"
                  onClick={() => {
                    navigate(`/project`);
                  }}
                />
                <EditButton
                  height={20}
                  width={20}
                  strokeColor="black"
                  pathFill="none"
                  title="Edit Project"
                  onClick={() => {
                    navigate(`/project/${currentProject.id}`);
                  }}
                />
              </>
            ) : (
              <>
                No current project
                <AddButton
                  height={20}
                  width={20}
                  strokeColor="black"
                  pathFill="none"
                  title="Change Project"
                  onClick={() => {
                    navigate(`/project`);
                  }}
                />
              </>
            )}
          </div>
        </div>
        <div className={styles.matching_schemas_container}>
          <h3 className={styles.matching_schemas_title}>Matching Schemas</h3>

          {/* If no matching schemas, then display default */}
          <div className={styles.matching_schema_content_container}>
            {matchingSchemas && matchingSchemas.length > 0 ? (
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
  const tab = useContext(TabContext);
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
        <AppButtonTemplate
          onClick={() => {
            openSidePanel(tab, "create_schema",  null);
          }}
        >
          Create
        </AppButtonTemplate>,
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
          if (matchingSchemas && matchingSchemas.length > 0) {
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
