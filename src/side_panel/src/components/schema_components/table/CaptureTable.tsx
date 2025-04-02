import { useContext, useMemo, useRef } from "react";
import ToastContext from "../../../context/Toast";
import {
  DeleteButton,
  EditButton,
} from "../../../../../shared/src/assets/icons/appIcons";
import { AppButtonTemplate } from "../../../../../shared/src/components/buttons/appButton";
import ModelReducerContext from "../../../context/ModelReducerContext";

/**
 * When keys are deleted, updated or added, call the modelREducerObject
 * update function with all the keys stored in the Schema Form Table.
 *
 * Each row contains state related to an individual item. oChanges to these items will
 * call an update for the global  modelReducerObject
 */
export const CaptureTable: React.FC<SchemaFormTableProps> = ({ operation }) => {
  const [formModel, modelReducerObject] = useContext(ModelReducerContext);

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

  return (
    <>
      {formModel && (
        <table>
          <thead>
            <td>Key</td>
            <td>Value</td>
          </thead>
          <tbody>
            {formModel[objectType] &&
              Object.values(formModel[objectType]).map((entry: SchemaEntry) => {
                return (
                  <TableRowTemplate
                    entry={entry}
                    index={entry.id}
                    handleChange={handleChange}
                    handleDelete={handleDelete}
                    operation={operation}
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
  entry,
  index,
}) => {
  const [, setToastState] = useContext(ToastContext);

  const keyRef = useRef<HTMLInputElement>(null);
  const valueRef = useRef<HTMLInputElement>(null);
  return (
    <tr key={index}>
      <td>
        <input
          ref={keyRef}
          type="text"
          value={entry.key.matched_value}
          maxLength={20}
          readOnly
        />
      </td>
      <td>
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
          height={20}
          width={20}
          title="Edit"
          onClick={() => {
            valueRef.current.focus();
          }}
        />
      </td>
      <td>
        <DeleteButton
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
