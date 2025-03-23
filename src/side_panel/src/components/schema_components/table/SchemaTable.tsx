import { useContext, useMemo, useRef } from "react";
import ToastContext from "../../../context/Toast";
import {
  AddButton,
  DeleteButton,
} from "../../../../../shared/src/assets/icons/appIcons";
import * as styles from "./SchemaTable.module.css";
import { AppDropdown } from "../../../../../shared/src/components/dropdownSelector/AppDropdown";
import { AppButtonTemplate } from "../../../../../shared/src/components/buttons/appButton";

// h
const handleKeyChange = (
  matchExpression: string,
  matchType: "id" | "css selector" | "regex" | "manual"
): Promise<string> => {
  //
  return new Promise((resolve, reject) => {
    // Check if manual match expression collides with existing key
  });
};

/**
 * Generic helper function to fetch matching elements from the DOM
 * @param value
 * @param matchType
 * @returns
 */
const fetchValue = (
  matchExpression: string,
  matchType: "id" | "css selector" | "regex"
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Must message service worker to trigger a content script to obtain the request value
    resolve("hello");
  });
};

/**
 * When keys are deleted, updated or added, call the modelREducerObject
 * update function with all the keys stored in the Schema Form Table.
 *
 * Each row contains state related to an individual item. oChanges to these items will
 * call an update for the global  modelReducerObject
 */
export const SchemaTable: React.FC<SchemaFormTableProps> = ({
  operation,
  formModel,
  modelReducerObject,
}) => {
  const objectType = useMemo(() => {
    return formModel.capture_body ? "capture_body" : "schema";
  }, []);

  const [, setToastState] = useContext(ToastContext);

  /**
   * Changing and adding schema values requires dyanmic updates to the model,
   * as changes to matching expression will trigger dynamic updates of matched_values
   *
   */
  const fetchTimerRef = useRef(null);
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
      clearTimeout(fetchTimerRef.current);

      fetchTimerRef.current = setTimeout(() => {
        fetchInProgressRef.current = true;

        // If match expression is edited, then use that, else use expression in model
        const matchExpression =
          matchProperty === "match_expression"
            ? value
            : formModel[objectType][key][valueEdited]["match_expression"];


        const matchType =
          matchProperty === "match_type"
            ? value
            : formModel[objectType][key][valueEdited]["match_type"];

        if (valueEdited == "key") {
          handleKeyChange(matchExpression, matchType)
            .then(() => {})
            .catch(() => {});
        } else {
          fetchValue(matchExpression, matchType)
            .then((newValue) => {
              // Validation

              // Update model
              formModel[objectType][key][valueEdited]["match_expression"] =
                matchExpression;
              formModel[objectType][key][valueEdited]["match_type"] = matchType;
              formModel[objectType][key][valueEdited]["matched_value"] =
                newValue;
              modelReducerObject.update(objectType, formModel[objectType]);

              resolve();
            })
            .catch(() => {

              formModel[objectType][key][valueEdited]["match_expression"] =
                matchExpression;
              formModel[objectType][key][valueEdited]["match_type"] = matchType;
              formModel[objectType][key][valueEdited]["matched_value"] =
                "ERROR";

              modelReducerObject.update(objectType, formModel[objectType]);

              reject();
            });
        }
      }, 100);
    });
  };

  /**
   * Delete row, schemEntry
   */
  const handleDelete = (key: string) => {
    // Key is the entry, vaue edited is either schema key or schema  value, match property is instantiated values for each key
    delete formModel[objectType][key];

    // Update model reducer
    modelReducerObject.update(objectType, formModel[objectType]);
  };

  const handleAdd = () => {
    // Empty entry
    if (formModel[objectType]["empty"]) return;

    formModel[objectType]["empty"] = {
      key: {
        match_expression: "",
        match_type: "manual",
        match_value: "",
      },
      value: {
        match_expression: "",
        match_type: "id",
        match_value: "",
      },
    };

    // Update model reducer
    modelReducerObject.update(objectType, formModel[objectType]);
  };

  return (
    <>
      {formModel[objectType] && (
        <table className={styles.table_outer}>
          <thead>
            <td>Key</td>
            <td>Value</td>
          </thead>
          <tbody className={styles.table_body}>
            {Object.entries(formModel[objectType]).map((entry, index) => {
              return (
                <TableRowTemplate
                  entry={entry}
                  handleChange={handleChange}
                  handleDelete={handleDelete}
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

const TableRowTemplate = ({ operation, handleChange, handleDelete, entry }) => {
  const [, setToastState] = useContext(ToastContext);

  const keyRef = useRef(null);
  const valueRef = useRef(null);

  const matchedKeyRef = useRef(null);
  const matchedValueRef = useRef(null);

  return (
    <tr className={styles.schema_row_container}>
      <td className={styles.schema_key_container}>
        <div className={styles.match_expression_container}>
          <input
            ref={keyRef}
            type="text"
            value={entry[1].key.match_expression}
            maxLength={20}
            onChange={(e) => {
              handleChange(
                keyRef,
                e.target.value,
                entry[0],
                "key",
                "match_expression"
              );
            }}
          />
          <AppDropdown
            options={["manual", "id", "css selector", "regex"]}
            set={entry[1].key.match_type}
            onChange={(e) => {
              handleChange(e.target.value, entry[0], "key", "match_type");
            }}
          ></AppDropdown>
        </div>
        <div>
          e.g.:
          <p className={styles.example_match_container} ref={matchedKeyRef}>
            {entry[1].key.matched_value}
          </p>
        </div>
      </td>
      <td>
        <div className={styles.match_expression_container}>
          <input
            ref={valueRef}
            type="text"
            value={entry[1].value.match_expression}
            maxLength={20}
            onChange={(e) => {
              /* Returns a promise */
              handleChange(
                valueRef,
                e.target.value,
                entry[0],
                "value",
                "match_expression"
              );
            }}
          />
          <AppDropdown
            options={["id", "css selector", "regex"]}
            set={entry[1].value.match_type}
            onChange={(e) => {
              handleChange(valueRef, e.target.value, entry[0], "value", "match_type");
            }}
          ></AppDropdown>
        </div>
        <div>
          {/* Example match, but is not saved to schema */}
          e.g.:
          <p className={styles.example_match_container} ref={matchedValueRef}>
            {entry[1].value.matched_value}
          </p>
        </div>
      </td>
      <td>
        <DeleteButton
          height={20}
          width={20}
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
                    handleDelete(entry[0]);
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
