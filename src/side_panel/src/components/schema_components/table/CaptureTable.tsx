import { useContext, useEffect, useMemo, useRef } from "react";
import ToastContext from "../../../context/Toast";
import {
  DeleteButton,
  EditButton,
} from "../../../../../shared/src/assets/icons/appIcons";
import { AppButtonTemplate } from "../../../../../shared/src/components/buttons/appButton";
import ModelReducerContext from "../../../context/ModelReducerContext";
import * as styles from "./CaptureTable.module.css";
import ExtensionContext from "../../../context/ExtensionObjects";

/**
 * When keys are deleted, updated or added, call the modelREducerObject
 * update function with all the keys stored in the Schema Form Table.
 *
 * Each row contains state related to an individual item. oChanges to these items will
 * call an update for the global  modelReducerObject
 */
export const CaptureTable: React.FC<SchemaFormTableProps> = ({ operation }) => {
  const [formModel, modelReducerObject, focusedCell] =
    useContext(ModelReducerContext);

  const objectType = useMemo(() => {
    return operation === "edit_capture" ? "capture_body" : "schema";
  }, [operation, formModel]);

  /**
   * When editing a capturen only the matched_value can be changed
   */
  const handleChange = (value: string | null, key: string) => {
    // Key is the entry, vaue edited is either schema key or schema  value, match property is instantiated values for each key
    formModel[objectType][key]["value"]["matched_value"] = value;

    // Update model reducer
    modelReducerObject.update(objectType, formModel[objectType]);
  };

  /**
   * Delete row, schemaEntry
   */
  const handleDelete = (entryId: string) => {
    // Update model reducer
    modelReducerObject.deleteRow(entryId);
  };

  // Change focussed cell
  const handleFocus = (cellId: string) => {
    modelReducerObject.focusOnCell(cellId);
  };

  // Listen to send data options from page
  const [tab, port] = useContext(ExtensionContext);
  useEffect(() => {
    if (port) {
      port.onMessage.addListener((message: BackendMessage) => {
        if (message.operation === "sendDOMData") {
          const { data } = message;

          if (data.type === "fetchOne") {
            modelReducerObject.updateCurrentCell(data);
          }
        }
      });
    }
  }, []);
  return (
    <>
      {formModel && (
        <table className={styles.table_outer}>
          <thead>
            <td>Key</td>
            <td>Value</td>
            <td className={styles.options_header}>Options</td>
          </thead>
          <tbody className={styles.table_body}>
            {formModel[objectType] &&
              Object.values(formModel[objectType]).map((entry: SchemaEntry) => {
                return (
                  <TableRowTemplate
                    entry={entry}
                    index={entry.id}
                    handleChange={handleChange}
                    handleDelete={handleDelete}
                    handleFocus={handleFocus}
                    operation={operation}
                    focusedCell={focusedCell}
                  />
                );
              })}
          </tbody>
        </table>
      )}
    </>
  );
};

const TableRowTemplate = ({
  operation,
  handleChange,
  handleDelete,
  handleFocus,
  focusedCell,
  entry,
  index,
}) => {
  const [, setToastState] = useContext(ToastContext);

  const keyRef = useRef<HTMLInputElement>(null);
  const valueRef = useRef<HTMLInputElement>(null);
  return (
    <tr className={styles.schema_row_container} key={index}>
      <td
        className={styles.data_cell}
        style={{
          borderLeft: focusedCell === `${index}-key` ? "solid 1px red" : "none",
          borderRight:
            focusedCell === `${index}-key`
              ? "solid 1px red"
              : "solid black 1px",
          borderTop: focusedCell === `${index}-key` ? "solid 1px red" : "none",
          borderBottom:
            focusedCell === `${index}-key` ? "solid 1px red" : "none",
        }}
        id={`${index}-key`}
        onClick={() => {
          handleFocus(`${index}-key`);
        }}
      >
        {entry.key.matched_value}
      </td>
      <td
        className={styles.data_cell}
        id={`${index}-value`}
        style={{
          borderLeft:
            focusedCell === `${index}-value` ? "solid 1px red" : "none",
          borderRight:
            focusedCell === `${index}-value`
              ? "solid 1px red"
              : "solid black 1px",
          borderTop:
            focusedCell === `${index}-value` ? "solid 1px red" : "none",
          borderBottom:
            focusedCell === `${index}-value` ? "solid 1px red" : "none",
        }}
        onClick={() => {
          handleFocus(`${index}-value`);
        }}
      >
        <input
          ref={valueRef}
          type="text"
          value={entry.value.matched_value}
          maxLength={20}
          onChange={(e) => {
            handleChange(e.target.value, entry.id);
          }}
        />
        <EditButton
          pathFill="none"
          strokeColor="black"
          height={20}
          width={20}
          title="Edit"
          onClick={() => {
            valueRef.current.focus();
          }}
        />
      </td>
      <td className={styles.option_container}>
        <DeleteButton
          pathFill="none"
          strokeColor="black"
          height={20}
          width={20}
          title="Delete"
          onClick={() => {
            setToastState({
              open: true,
              text: (
                <p>
                  Are you sure you want to delete {entry.key.matched_value}?
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
                  No
                </AppButtonTemplate>,
                <AppButtonTemplate
                  onClick={() => {
                    handleDelete(entry.id);
                    setToastState({
                      open: false,
                    });
                  }}
                >
                  Yes
                </AppButtonTemplate>,
              ],
            });
          }}
        />
      </td>
    </tr>
  );
};
