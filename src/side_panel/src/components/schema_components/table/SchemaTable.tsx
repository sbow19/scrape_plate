import { useContext, useMemo, useRef } from "react";
import ToastContext from "../../../context/Toast";
import {
  AddButton,
  DeleteButton,
} from "../../../../../shared/src/assets/icons/appIcons";
import * as styles from "./SchemaTable.module.css";
import { AppDropdown } from "../../../../../shared/src/components/dropdownSelector/AppDropdown";
import { AppButtonTemplate } from "../../../../../shared/src/components/buttons/appButton";

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
    resolve("No Match");
  });
};

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
   * Changing content of the schema model in the component will cause continous
   * fetches from the DOM and internal state updates. Therefore we throttle the 
   * amount of requqests for updates by keeping track of a  set timeout callback.
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
      if (fetchInProgressRef.current) {
        resolve();
        return;
      }
      clearTimeout(fetchTimerRef.current);

      // RESET INPUT RE STYLE
      inputRef.current.style.border = "";
      inputRef.current.style.color = "white";
      inputRef.current.style.innerText = "";

      // STEP 2: set delay for DOM value fetch, async operation
      fetchTimerRef.current = setTimeout(() => {
        // Stop further requests while fetching data
        fetchInProgressRef.current = true;

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

        // STEP 3: Validate the matched value for key and values
        if (valueEdited == "key") {
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
          }

          // Fetch DOM content with Promise
          fetchValue(matchExpression, matchType)
            .then((newValue) => {
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
          fetchValue(matchExpression, matchType)
            .then((newValue) => {
              // Validation

              formModel[objectType][key][valueEdited]["match_expression"] =
                matchExpression;
              formModel[objectType][key][valueEdited]["match_type"] = matchType;
              formModel[objectType][key][valueEdited]["matched_value"] =
                newValue;
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
      }, 50);
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
    let newId = crypto.randomUUID();

    // Check if id already exists
    while (formModel[objectType][newId]) {
      newId = crypto.randomUUID();
    }

    formModel[objectType][newId] = {
      id: newId,
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
            {Object.values(formModel[objectType]).map((entry) => {
              return (
                <TableRowTemplate
                  index={entry.id}
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

const TableRowTemplate = ({
  operation,
  handleChange,
  handleDelete,
  entry,
  index,
}) => {
  const [, setToastState] = useContext(ToastContext);

  // Match expression input element
  const keyRef = useRef(null);
  const valueRef = useRef(null);

  // Returned value from  match
  const matchedKeyRef = useRef(null);
  const matchedValueRef = useRef(null);


  return (
    <tr className={styles.schema_row_container} key={index}>
      <td className={styles.schema_key_container}>
        <div className={styles.match_expression_container}>
          <input
            ref={keyRef}
            type="text"
            value={entry.key.match_expression}
            maxLength={20}
            onChange={(e) => {
              handleChange(
                matchedKeyRef,
                e.target.value,
                entry.id,
                "key",
                "match_expression"
              );
            }}
          />
          <AppDropdown
            options={["manual", "id", "css selector", "regex"]}
            set={entry.key.match_type}
            onChange={(e) => {
              handleChange(
                matchedKeyRef,
                e.target.value,
                entry.id,
                "key",
                "match_type"
              );
            }}
          ></AppDropdown>
        </div>
        <div>
          e.g.:
          <p className={styles.example_match_container} ref={matchedKeyRef}>
            {entry.key.matched_value}
          </p>
        </div>
      </td>
      <td>
        <div className={styles.match_expression_container}>
          <input
            ref={valueRef}
            type="text"
            value={entry.value.match_expression}
            maxLength={20}
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
          <AppDropdown
            options={["id", "css selector", "regex"]}
            set={entry.value.match_type}
            onChange={(e) => {
              handleChange(
                valueRef,
                e.target.value,
                entry.id,
                "value",
                "match_type"
              );
            }}
          ></AppDropdown>
        </div>
        <div>
          {/* Example match, but is not saved to schema */}
          e.g.:
          <p className={styles.example_match_container} ref={matchedValueRef}>
            {entry.value.matched_value}
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
