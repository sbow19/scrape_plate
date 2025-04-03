import { useContext, useEffect, useMemo, useRef } from "react";
import ToastContext from "../../../context/Toast";
import {
  AddButton,
  DeleteButton,
} from "../../../../../shared/src/assets/icons/appIcons";
import * as styles from "./SchemaTable.module.css";
import { AppDropdown } from "../../../../../shared/src/components/dropdownSelector/AppDropdown";
import { AppButtonTemplate } from "../../../../../shared/src/components/buttons/appButton";
import ExtensionContext from "../../../context/ExtensionObjects";
import { fetchValue } from "../../../utils/fetchValue";
import ModelReducerContext from "../../../context/ModelReducerContext";

/**
 * When keys are deleted, updated or added, call the modelREducerObject
 * update function with all the keys stored in the Schema Form Table.
 *
 * Each row contains state related to an individual item. Changes to these items will
 * call an update for the global  modelReducerObject.
 *
 * When the user saves changes, the current schema object in the Table will  be taken
 * and used to update the User Content Model as a batch.
 */
export const SchemaTable: React.FC<SchemaFormTableProps> = ({ operation }) => {
  const [formModel, modelReducerObject, focusedCell] =
    useContext(ModelReducerContext);

  const objectType = useMemo(() => {
    return operation === "edit_capture" ? "capture_body" : "schema";
  }, [operation, formModel]);

  /**
   * Changing content of the schema model in the component will cause continous
   * fetches from the DOM and internal state updates. Therefore we throttle the
   * amount of requqests for updates by keeping track of a  set timeout callback.
   *
   */
  const fetchTimerRef = useRef<NodeJS.Timeout>(null);
  const fetchInProgressRef = useRef(false);

  const handleChange = (
    inputRef: React.Ref<HTMLInputElement>,
    value: string | null,
    key: string,
    valueEdited: "key" | "value",
    matchProperty: "match_expression" | "match_type" | "match_value"
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      // STEP 1: Check if fetch operation already taking place - override using setTimeout
      if (fetchInProgressRef.current) {
        resolve();
        return;
      }

      if (!inputRef || !inputRef.current) {
        reject();
        return;
      }
      clearTimeout(fetchTimerRef?.current ?? undefined);

      // If match expression is edited, then use that, else use expression in form model
      const matchExpression =
        matchProperty === "match_expression"
          ? value
          : formModel[objectType][key][valueEdited]["match_expression"];

      // And vice-versa
      const matchType =
        matchProperty === "match_type"
          ? value
          : formModel[objectType][key][valueEdited]["match_type"];
      // Check manual key/matched value generation
      if (matchType === "manual") {
        formModel[objectType][key][valueEdited]["match_expression"] =
          matchExpression;
        formModel[objectType][key][valueEdited]["match_type"] = matchType;
        formModel[objectType][key][valueEdited]["matched_value"] = value;

        modelReducerObject.update(objectType, formModel[objectType]);
        fetchInProgressRef.current = false;
        resolve();
        return;
      } else {
        // Update typing immediately
        formModel[objectType][key][valueEdited]["match_expression"] =
          matchExpression;
        formModel[objectType][key][valueEdited]["match_type"] = matchType;
        modelReducerObject.update(objectType, formModel[objectType]);
      }

      // RESET INPUT RE STYLE
      inputRef.current.style.border = "";
      inputRef.current.style.color = "black";
      inputRef.current.style.innerText = "";

      // STEP 2: set delay for DOM value fetch, async operation
      fetchTimerRef.current = setTimeout(() => {
        // Stop further requests while fetching data
        fetchInProgressRef.current = true;

        // STEP 3: Validate the matched value for key and values
        if (valueEdited == "key") {
          // Fetch DOM content with Promise
          fetchValue(matchExpression, matchType, port)
            .then((domDataPoint) => {
              // Update model
              formModel[objectType][key][valueEdited]["matched_value"] =
                domDataPoint.matchValue;
              modelReducerObject.update(objectType, formModel[objectType]);

              resolve();
            })
            .catch(() => {
              // Change style
              inputRef.current.style.border = "1px solid red";
              inputRef.current.style.color = "red";
              inputRef.current.innerText = "Error Fetching Value";

              reject();
            })
            .finally(() => {
              fetchInProgressRef.current = false;
            });
        } else if (valueEdited === "value") {
          fetchValue(matchExpression, matchType, port)
            .then((domDataPoint) => {
              // Validation

              formModel[objectType][key][valueEdited]["matched_value"] =
                domDataPoint.matchValue;
              modelReducerObject.update(objectType, formModel[objectType]);

              resolve();
            })
            .catch(() => {
              // Change style
              inputRef.current.style.border = "1px solid red";
              inputRef.current.style.color = "red";
              inputRef.current.innerText = "Error fetching value";

              reject();
            })
            .finally(() => {
              fetchInProgressRef.current = false;
            });
        }
      }, 1000);
    });
  };

  /**
   * Delete row
   */
  const handleDelete = (entryId: string) => {
    modelReducerObject.deleteRow(entryId);
  };

  // Add new row and change cell focus
  const handleAdd = () => {
    modelReducerObject.addNewRow();
  };

  // Change focussed cell
  const handleFocus = (cellId: string) => {
    modelReducerObject.focusOnCell(cellId);
  };

  // Move to next cell
  const handleMove = (command: string) => {
    modelReducerObject.moveFocusedCell(command);
  };

  // Key press
  useEffect(() => {
    function handleEnter(e) {
      if (e.key.toLowerCase() === "enter") {
        modelReducerObject.moveFocusedCell("next");
      }
    }

    document.addEventListener("keyup", handleEnter);

    return () => {
      document.removeEventListener("keyup", handleEnter);
    };
  }, []);

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

  // Add new row if create schema
  useEffect(() => {
    if (operation === "create_schema") {
      handleAdd();
    } else if (operation === "edit_schema") {
      /**
       * Defer operatino because internally the cell focus tracker is initialised using useEffect.
       * Therefore need to defer until fully initiliazed state
       */
      setTimeout(() => {
        modelReducerObject.moveFocusedCell("last");
      }, 1);
    }
  }, []);

  return (
    <>
      {formModel && (
        <table className={styles.table_outer}>
          <thead>
            <td>Key</td>
            <td>Value</td>
            <td className={styles.options_header}>options</td>

          </thead>
          <tbody className={styles.table_body}>
            {formModel[objectType] &&
              Object.values(formModel[objectType]).map((entry: SchemaEntry) => {
                return (
                  <TableRowTemplate
                    entryId={entry.id}
                    entry={entry}
                    handleChange={handleChange}
                    handleDelete={handleDelete}
                    handleFocus={handleFocus}
                    handleMove={handleMove}
                    focusedCell={focusedCell}
                    operation={operation}
                  />
                );
              })}
          </tbody>
          {operation !== "edit_capture" && (
            <tfoot className={styles.add_row_button}>
              <AddButton
                height={30}
                width={30}
                strokeColor="black"
                pathFill="none"
                title="Add Entry"
                onClick={handleAdd}
              ></AddButton>
            </tfoot>
          )}
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
  handleMove,
  focusedCell,
  entry,
  entryId,
}) => {
  const [, setToastState] = useContext(ToastContext);

  // Match expression input element
  const keyRef = useRef(null);
  const valueRef = useRef(null);

  // Returned value from  match
  const matchedKeyRef = useRef(null);
  const matchedValueRef = useRef(null);

  return (
    <tr className={styles.schema_row_container} key={entryId}>
      {/* ASSIGN CELL ID AS ROW ID AND KEY OR VALUE */}
      <td
        className={styles.schema_key_container}
        style={{
          borderLeft: focusedCell === `${entryId}-key` ? "solid 1px red" : "none",
          borderRight: focusedCell === `${entryId}-key` ? "solid 1px red" : "solid black 1px",
          borderTop: focusedCell === `${entryId}-key` ? "solid 1px red" : "none",
          borderBottom: focusedCell === `${entryId}-key` ? "solid 1px red" : "none"
        }}
        id={`${entryId}-key`}
        onClick={() => {
          handleFocus(`${entryId}-key`);
        }}
      >
        <div className={styles.match_expression_container}>
          <AppDropdown
            options={["manual", "id", "css selector", "regex"]}
            set={entry.key.match_type}
            onChange={(e) => {
              handleChange(
                matchedKeyRef,
                e.target.value,
                entryId,
                "key",
                "match_type"
              );
            }}
          ></AppDropdown>
          <textarea
            placeholder="Please type match expression..."
            ref={keyRef}
            value={entry.key.match_expression}
            maxLength={40}
            autoFocus={focusedCell === `${entryId}-key` ? true : false}
            onChange={(e) => {
              handleChange(
                matchedKeyRef,
                e.target.value,
                entryId,
                "key",
                "match_expression"
              );
            }}
          />
        </div>
        <div className={styles.example_match_container_outer}>
          <p className={styles.example_match_title}>Match: </p>
          <p className={styles.example_match_container} ref={matchedKeyRef}>
            {entry.key.matched_value}
          </p>
        </div>
      </td>
      <td
        id={`${entryId}-value`}
        className={styles.schema_value_container}
        style={{
          borderLeft: focusedCell === `${entryId}-value` ? "solid 1px red" : "none",
          borderRight: focusedCell === `${entryId}-value` ? "solid 1px red" : "solid black 1px",
          borderTop: focusedCell === `${entryId}-value` ? "solid 1px red" : "none",
          borderBottom: focusedCell === `${entryId}-value` ? "solid 1px red" : "none"


        }}
        onClick={() => {
          handleFocus(`${entryId}-value`);
        }}
      >
        <div className={styles.match_expression_container}>
          <AppDropdown
            options={["id", "css selector", "regex"]}
            set={entry.value.match_type}
            onChange={(e) => {
              handleChange(
                valueRef,
                e.target.value,
                entryId,
                "value",
                "match_type"
              );
            }}
          ></AppDropdown>
          <textarea
            placeholder="Please type match expression..."
            ref={valueRef}
            value={entry.value.match_expression}
            maxLength={100}
            autoFocus={focusedCell === `${entryId}-value` ? true : false}
            onChange={(e) => {
              /* Returns a promise */
              handleChange(
                valueRef,
                e.target.value,
                entry.id,
                "value",
                "match_expression"
              );
            }}
          />
        </div>
        <div className={styles.example_match_container_outer}>
          {/* Example match, but is not saved to schema */}
          <p className={styles.example_match_title}>Match:</p>
          <p className={styles.example_match_container} ref={matchedValueRef}>
            {entry.value.matched_value}
          </p>
        </div>
      </td>
      <td className={styles.option_container}>
        <DeleteButton
          height={20}
          width={20}
          pathFill="none"
          strokeColor="black"
          onClick={() => {
            setToastState({
              open: true,
              text: <p>Are you sure you want to delete {entry[0]}?</p>,
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
