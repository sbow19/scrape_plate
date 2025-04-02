/**
 * Table template
 */

import { useCallback, useContext } from "react";
import * as styles from "./appTable.module.css";
import {
  EditButton,
  DeleteButton,
  AddButton,
} from "../../../../shared/src/assets/icons/appIcons";
import { useNavigate } from "react-router";
import ToastContext from "../../context/Toast";
import { AppButtonTemplate } from "../../../../shared/src/components/buttons/appButton";
import useContent from "../../../../shared/src/hooks/useContent";

export const AppTableTemplate: React.FC<AppTableProps> = ({
  tableData,
  options,
  resetTableData,
}) => {
  const navigate = useNavigate();

  /**
   * TOAST OPERATIONS
   */
  const [, setToastState] = useContext(ToastContext);
  const userContentEvents = useContent();

  const handleDeleteEntry = (row: Array<string>) => {
    setToastState((prevState) => ({
      ...prevState,
      open: true,
      text: <p> Are you sure you want to delete {row[1]}?</p>,
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
            const deleteCrud: CRUDDataOptions = {
              method: "delete",
              type: "",
              data: "", // Table data rows first index always includes id of row data
            };

            switch (options.dataType) {
              case "project":
                deleteCrud.type = "project";
                deleteCrud.data = row[0];
                break;
              case "schema":
                deleteCrud.type = "schema";
                deleteCrud.data = row[0];
                break;
              case "schemaEntry":
                deleteCrud.type = "schemaEntry";
                deleteCrud.data = {
                  schema_id: options.ownerId,
                  id: row[0],
                };
                break;
              case "capture":
                deleteCrud.type = "capture";
                deleteCrud.data = {
                  project_id: options.ownerId,
                  id: row[0],
                };

                break;
              case "captureRow":
                deleteCrud.type = "captureRow";
                deleteCrud.data = {
                  project_id: options.ownerId.project_id,
                  capture_id: options.ownerId.capture_id,
                  id: row[0],
                };

                break;
            }

            userContentEvents
              ?.emit("delete", deleteCrud)
              .then((beResponse: BackendResponse) => {
                resetTableData((prev) => !prev);
              })
              .catch((e) => {
                setToastState({
                  open: true,
                  timer: 1000,
                  text: <p>Error: failed to delete{row[1]}</p>,
                });
              })
              .finally(() => {
                setToastState({
                  open: false,
                });
              });
          }}
        >
          {" "}
          Yes{" "}
        </AppButtonTemplate>,
      ],
    }));
  };

  const handleSetCurrentProject = useCallback(
    (row: Array<string>) => {
      userContentEvents
        ?.emit("getAllOf", "details")
        .then((userContentDetails: UserContentDetails) => {
          userContentDetails.currentProject = row[0]; // Set current project id

          return userContentEvents.emit("update", {
            method: "update",
            type: "details",
            data: userContentDetails,
          });
        })
        .then((be: BackendResponse) => {
          setToastState({
            open: true,
            timer: 1000,
            text: <p>Set {row[1]} as current project</p>,
          });
        })
        .catch((error) => {
          setToastState({
            open: true,
            timer: 1000,
            text: <p>Unable to update current project</p>,
          });
        });
    },
    [setToastState]
  );

  return (
    <>
      {tableData?.data && (
        <table className={styles.table_outer}>
          <thead>
            {tableData.header.map((header, index) => {
              return (
                <>
                  <td key={index}>{header}</td>
                </>
              );
            })}
            {/**
             * Options button optional if at least one is enabled
             */}
            {options ? <th key={"options_header"}>options</th> : null}
          </thead>
          <tbody className={styles.table_body}>
            {tableData.data.map((row, index) => {
              return (
                <tr key={index}>
                  {row.map((dataPoint, index) => {
                    // Skip first element as its reserved for ids
                    if (index === 0) return;
                    return (
                      <td
                        key={index}
                        className={
                          options?.enableInLineEdit ?? null ? "inline" : ""
                        }
                      >
                        {dataPoint}
                      </td>
                    );
                  })}
                  {/**
                   * Options button optional if at least one is enabled
                   */}
                  {options ? (
                    <td className={styles.options_container}>
                      {options?.enableSet && (
                        <AddButton
                          height={25}
                          width={25}
                          strokeColor="black"
                          onClick={() => handleSetCurrentProject(row)}
                          title="Set As Current Project"
                        />
                      )}
                      {options?.enableEdit && (
                        <EditButton
                          height={25}
                          width={25}
                          strokeColor="black"
                          pathFill="none"
                          onClick={() => {
                            navigate(`/${options.dataType}/${row[0]}`);
                          }}
                          title="Edit"
                        />
                      )}
                      {options?.enableDelete && (
                        <DeleteButton
                          height={25}
                          width={25}
                          strokeColor="black"
                          pathFill="none"
                          onClick={() => handleDeleteEntry(row)}
                          title="Delete"
                        />
                      )}
                    </td>
                  ) : null}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
};
