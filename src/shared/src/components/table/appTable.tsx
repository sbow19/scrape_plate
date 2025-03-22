/**
 * Table template
 */

import { useCallback, useContext } from "react";
import * as styles from "./appTable.module.css";
import { EditButton, DeleteButton } from "../../assets/icons/appIcons";
import { useNavigate } from "react-router";
import ToastContext from "../../../../action/src/context/Toast";
import { AppButtonTemplate } from "../buttons/appButton";

export const AppTableTemplate: React.FC<AppTableProps> = ({
  tableData,
  options,
}) => {
  const navigate = useNavigate();

  /**
   * TOAST OPERATIONS
   */
  const [, setToastState] = useContext(ToastContext);
  const handleDeleteEntry = useCallback(
    (row: Array<string>) => {
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
              setToastState({
                open: false,
              });
            }}
          >
            {" "}
            Yes{" "}
          </AppButtonTemplate>,
        ],
      }));
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
                      {options?.enableEdit && (
                        <EditButton
                          height={25}
                          width={25}
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
                          onClick={() =>
                            handleDeleteEntry(row)
                          }
                          title='Delete'
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
