/**
 * Capture search page
 */
import { PopupTemplate } from "../components/popup_template";
import { AppButtonTemplate } from "../../../shared/src/components/buttons/appButton";
import { AppTableTemplate } from "../components/table/appTable";
import {
  useState,
  useCallback,
  useRef,
  useMemo,
  useContext,
  useEffect,
} from "react";
import * as styles from "./captureView.module.css";
import {
  EditButton,
  HomeButton,
} from "../../../shared/src/assets/icons/appIcons";
import {
  convertISOToDate,
  tableDataConverter,
} from "../../../shared/src/utils/helpers";
import ToastContext from "../context/Toast";
import { AppDropdown } from "../../../shared/src/components/dropdownSelector/AppDropdown";
import { useNavigate, useParams } from "react-router";
import useContent from "../../../shared/src/hooks/useContent";

export const CaptureView = () => {
  /*Get capture id passed via url */
  const params = useParams();
  const userContentEvent = useContent();

  // Set local version of capture details
  const [captureDetails, setCaptureDetails] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    userContentEvent
      ?.emit("search", {
        type: "capture",
        term: params.captureId,
      })
      .then((results: Array<Capture>) => {
        if (results.length === 1) {
          setCaptureDetails(results[0]);
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
            captureDetails={captureDetails}
            setCaptureDetails={setCaptureDetails}
            setIsLoaded={setIsLoaded}
            isLoaded={isLoaded}
          />
        }
        secondaryActions={<SecondaryActions captureDetails={captureDetails} />}
        primaryAction={<PrimaryAction />}
        backButtonEnabled={true}
      />
    </>
  );
};

const ContentComponent = ({ captureDetails, setCaptureDetails, setIsLoaded, isLoaded}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFocus = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.readOnly = false;
      inputRef.current.focus();
    }
  }, []);


  const handleChangeText = (e) => {
    setCaptureDetails((prev: Capture) => {
      return {
        ...prev,
        name: e.target.value,
      };
    });
  }

  /**
   * Convert capture details to form usable by table template, i.e. table data type
   */


  const captureRows: TableData | null = useMemo(() => {

    if (!captureDetails.id) return null;

    return tableDataConverter(
      "capture",
      Object.values(captureDetails.capture_body)
    );
  

  }, [captureDetails, isLoaded]);

  return (
    <>
      <div className={styles.project_info_container}>
        <div className={styles.project_name_container}>
          <h3>
            Capture:
            <input
              ref={inputRef}
              type="text"
              value={captureDetails.name}
              className={styles.input_field}
              onChange={handleChangeText}
            />
          </h3>
          <EditButton
            height={20}
            width={20}
            strokeColor="black"
            pathFill="none"
            onClick={handleFocus}
            title="Edit Name"
          />
        </div>
        <div className={styles.created_at}>
          <b>Created At:</b> {convertISOToDate(captureDetails.date_created)}
        </div>
        <div className={styles.last_edited}>
          <b>Last Edited:</b> {convertISOToDate(captureDetails.last_edited)}
        </div>
        <div className={styles.table_title}>Captured Data</div>
      </div>
      <div className={styles.table_container}>
        <AppTableTemplate
          tableData={captureRows}
          resetTableData={setIsLoaded}
          options={{
            enableSet: false,
            enableDelete: true,
            enableEdit: false,
            enableInLineEdit: true,
            dataType: "captureRow",
            ownerId: {
              capture_id: captureDetails.id,
              project_id: captureDetails.project_id,
            }
          }}
        />
      </div>
    </>
  );
};

const SecondaryActions = ({ captureDetails }) => {
  const [toastState, setToastState] = useContext(ToastContext);
  const userContentEvents = useContent();
  const navigate = useNavigate();
  /**
   * Delete Capture toast trigger handler
   */
  const handleSaveCapture = useCallback(() => {
    setToastState({
      open: true,
      text: <p> Save changes to capture?</p>,
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
              type: "capture",
              data: captureDetails,
            })
            .then((be: BackendResponse) => {
              if (be.data.success) {
                setToastState({
                  open: true,
                  timer: 1000,
                  text: <p>Updated capture successfully</p>,
                });
              } else {
                throw be;
              }
            })
            .catch((e) => {
              console.log(e)
              setToastState({
                open: true,
                timer: 1000,
                text: <p>Error: failed to update capture details</p>,
              });
            });
        }}
        >
          {" "}
          Yes{" "}
        </AppButtonTemplate>,
      ],
    });
  }, [captureDetails]);

  /**
   * Export Capture toast trigger handler
   */
  const handleDeleteCapture = useCallback(() => {
    setToastState({
      open: true,
      text: (
        <p>
          Are you sure you want to capture
          {captureDetails.name}?
        </p>
      ), // Usually name of entry
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
          console.log(captureDetails)
          userContentEvents
            ?.emit("delete", {
              method: "delete",
              type: "capture",
              data:{
                id: captureDetails.id,
                project_id: captureDetails.project_id
              },
            })
            .then((be: BackendResponse) => {
              if (be.data.success) {
                setToastState({
                  open: true,
                  timer: 1000,
                  text: <p>Deleted capture successfully</p>,
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
                text: <p>Error: failed to delete capture.</p>,
              });
            });
        }}
        >
          {" "}
          Yes{" "}
        </AppButtonTemplate>,
      ],
    });
  }, [captureDetails]);

  /**
   * Save Capture toast trigger handler
   */
  const handleExportCapture = useCallback(() => {
    setToastState({
      open: true,
      text: (
        <p>
          How do you want to export {captureDetails.name}?
        </p>
      ),
      buttons: [
        <AppButtonTemplate
          onClick={() => {
            setToastState({
              open: false,
            });
          }}
        >
          Back
        </AppButtonTemplate>,
        <AppDropdown
          options={["json"]}
          data={captureDetails}
          set="json"
          exportButton={true}
        />,
      ],
    });
  }, [captureDetails]);
  return (
    <div className={styles.button_container}>
      <AppButtonTemplate
        textStyle={{
          color: "#fb3640ff",
        }}
        onClick={handleDeleteCapture}
      >
        Delete
      </AppButtonTemplate>
      <AppButtonTemplate
        onClick={handleExportCapture}
      >
        Export
      </AppButtonTemplate>
      <AppButtonTemplate
        textStyle={{
          color: "#006400",
        }}
        onClick={handleSaveCapture}
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
        strokeColor="black"
        pathFill="none"
        width={30}
        onClick={() => {
          navigate("/action/index.html");
        }}
        title="Home"
      />
    </>
  );
};
