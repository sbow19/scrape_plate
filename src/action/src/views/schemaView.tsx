/**
 * Schema search page
 */
import { AppButtonTemplate } from "../../../shared/src/components/buttons/appButton";
import { AppTableTemplate } from "../components/table/appTable";
import { tableDataConverter } from "../../../shared/src/utils/helpers";
import { PopupTemplate } from "../components/popup_template";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as styles from "./schemaView.module.css";
import {
  EditButton,
  HomeButton,
} from "../../../shared/src/assets/icons/appIcons";

import { useNavigate, useParams } from "react-router";
import ToastContext from "../context/Toast";
import useContent from "../../../shared/src/hooks/useContent";
import { openSidePanel } from "../utils/chromeMessaging";
import TabContext from "../context/Tab";

export const SchemaView = () => {
  const params = useParams();
  const userContentEvent = useContent();

  // Set local version of schema details
  const [schemaDetails, setSchemaDetails] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    userContentEvent
      ?.emit("search", {
        type: "schema",
        term: params.schemaId,
      })
      .then((results: Array<ProjectGroup>) => {
        if (results.length === 1) {
          setSchemaDetails(results[0]);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, [isLoaded]);

  return (
    <>
      <PopupTemplate
        contentComponent={
          <ContentComponent
            schemaDetails={schemaDetails}
            setSchemaDetails={setSchemaDetails}
            setIsLoaded={setIsLoaded}
            isLoaded={isLoaded}
          />
        }
        secondaryActions={<SecondaryActions schemaDetails={schemaDetails} />}
        primaryAction={<PrimaryAction />}
        backButtonEnabled={true}
      />
    </>
  );
};

const ContentComponent = ({
  schemaDetails,
  setSchemaDetails,
  setIsLoaded,
  isLoaded,
}) => {
  /**
   * Schema name handlers
   */
  const inputNameRef = useRef<HTMLInputElement>(null);
  const handleFocus = useCallback(() => {
    if (inputNameRef.current) {
      inputNameRef.current.focus();
    }
  }, []);

  // Input value
  const handleChangeText = (e) => {
    setSchemaDetails((prev) => {
      return {
        ...schemaDetails,
        name: e.target.value,
      };
    });
  };

  /**
   * Schema url match details
   */
  const schemaDetailsTable = useMemo(() => {
    if (!schemaDetails.schema) return null;
    return tableDataConverter("schema", Object.values(schemaDetails.schema));
  }, [schemaDetails, isLoaded]);

  return (
    <>
      <div className={styles.project_info_container}>
        <div className={styles.project_name_container}>
          <h3>
            Schema
            <input
              ref={inputNameRef}
              type="text"
              value={schemaDetails.name}
              className={styles.input_field}
              onChange={handleChangeText}
            />
          </h3>
          <EditButton
          pathFill="none"
          strokeColor="black"
            height={20}
            width={20}
            onClick={handleFocus}
            title="Edit Name"
          />
        </div>
        <div className={styles.url_match}>
          <b>URL Match:</b> {schemaDetails.url_match}
        </div>
        <div className={styles.table_title}>Schema Details</div>
      </div>
      <div className={styles.table_container}>
        <AppTableTemplate
          tableData={schemaDetailsTable}
          resetTableData={setIsLoaded}
          options={{
            enableDelete: true,
            enableEdit: false,
            enableSet: false,
            enableInLineEdit: false,
            dataType: "schemaEntry",
            ownerId: schemaDetails.id,
          }}
        />
      </div>
    </>
  );
};

const SecondaryActions = ({ schemaDetails }) => {
  const [, setToastState] = useContext(ToastContext);
  const userContentEvents = useContent();
  const navigate = useNavigate();
  const tab = useContext(TabContext);

  /**
   * Delete Schema toast trigger handler
   */
  const handleDeleteSchema = useCallback(() => {
    setToastState({
      open: true,
      text: <p> Are you sure you want to delete {schemaDetails.name}?</p>, // Usually name of entry
      buttons: [
        <AppButtonTemplate
          onClick={() => {
            setToastState({
              open: false,
            });
          }}
        >
          {" "}
          No{" "}
        </AppButtonTemplate>,
        <AppButtonTemplate
          onClick={() => {
            userContentEvents
              ?.emit("delete", {
                method: "delete",
                type: "schema",
                data: schemaDetails.id,
              })
              .then((be: BackendResponse) => {
                if (be.data.success) {
                  setToastState({
                    open: true,
                    timer: 1000,
                    text: <p>Deleted schema successfully</p>,
                  });

                } else {
                  throw be;
                }
                navigate(-1);
              })
              .catch((e) => {
                setToastState({
                  open: true,
                  timer: 1000,
                  text: <p>Error: failed to delete schema.</p>,
                });
              });
          }}
        >
          Yes
        </AppButtonTemplate>,
      ],
    });
  }, [setToastState, schemaDetails]);

  /**
   * Export Schema toast trigger handler
   */
  const handleEditSchema = useCallback(() => {
    openSidePanel(tab, "edit_schema", schemaDetails);
  }, [tab, schemaDetails]);

  /**
   * Save Schema toast trigger handler
   */
  const handleSaveSchema = useCallback(() => {
    setToastState({
      open: true,
      text: <p> Save changes to {schemaDetails.name}?</p>,
      buttons: [
        <AppButtonTemplate
          onClick={() => {
            setToastState({
              open: false,
            });
          }}
        >
          {" "}
          No{" "}
        </AppButtonTemplate>,
        <AppButtonTemplate
          onClick={() => {
            userContentEvents
              ?.emit("update", {
                method: "update",
                type: "schema",
                data: schemaDetails,
              })
              .then((be: BackendResponse) => {
                if (be.data.success) {
                  setToastState({
                    open: true,
                    timer: 1000,
                    text: <p>Updated schema successfully</p>,
                  });
                } else {
                  throw be;
                }
              })
              .catch((e) => {
                setToastState({
                  open: true,
                  timer: 1000,
                  text: <p>Error: failed to update schema details</p>,
                });
              });
          }}
        >
          {" "}
          Yes{" "}
        </AppButtonTemplate>,
      ],
    });
  }, [setToastState, schemaDetails]);
  return (
    <div className={styles.button_container}>
      <AppButtonTemplate
        textStyle={{
          color: "#fb3640ff",
        }}
        onClick={handleDeleteSchema}
      >
        Delete
      </AppButtonTemplate>
      <AppButtonTemplate

        onClick={handleEditSchema}
      >
        Edit
      </AppButtonTemplate>
      <AppButtonTemplate
        textStyle={{
          color: "#006400",
        }}
        onClick={handleSaveSchema}
      >
        Save
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
        onClick={() => {
          navigate("/action/index.html");
        }}
        title="Home"
      />
    </>
  );
};
