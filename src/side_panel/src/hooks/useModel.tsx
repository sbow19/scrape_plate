import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Keeps track of a virtual schema model, which can be edited and reset
 * before being saved to IndexedDB.
 *
 * E.g., for a create schema operation, the user will edit
 * the name, url_match, and schemaEntries, so this hook keeps track.
 *
 * User may provide an existing schema, or the content script may provide a
 * capture, which is replicated here.
 *
 * When multiple schemas are matched with the current url, multiple schemas
 * are sent to the side panel in order of relevance.
 *
 * Hook provides a reducer object, allowing other components nested in the side panel
 * to modify the virtual model.
 *
 * @param {ModelTypes} modelType Describes whether modelling Schema or Capture data
 * @param {Schema | Capture} existingModel Optional model to initialize, such as  with editing schema
 * @param {string} currentURL Reducer object checks changes to url match value in schema object against this value
 */
export const useModel = (
  modelType: ModelTypes,
  currentURL: string,
  existingModel: Schema | Capture | Schema[] | null
): [Schema | Capture, ReducerObject, string] => {
  if (!["schema", "capture"].includes(modelType)) {
    throw new Error("Incorrect model type for useModel hook");
  }

  const objectType = useMemo(() => {
    return modelType === "capture" ? "capture_body" : "schema";
  }, []);

  // Keep ref to original model for reset
  const originalModel = useRef(
    JSON.parse(
      JSON.stringify(
        existingModel ?? {
          ...JSON.parse(JSON.stringify(modelObject[modelType])),
          url_match: currentURL,
        }
      )
    )
  );

  /* CREATE BLANK MODEL OR COPY OF EXISITNG MODEL */
  const [model, setModel] = useState(
    JSON.parse(
      JSON.stringify(
        existingModel ?? {
          ...JSON.parse(JSON.stringify(modelObject[modelType])),
          url_match: currentURL,
        }
      )
    )
  );

  // Keep track of focussed cells and ids in SchemaModel object within model
  const [resetSchemaRows, setReset] = useState(true);

  // Set current focused cell
  const [focusedCell, setFocusedCell] = useState("");
  const cellListRef = useRef<CellList>({
    rowOrder: [],
    currentRow: "",
    focusedCell: "",
    schemaRows: {},
  });

  useEffect(() => {
    // Get the schema or Capture body
    const schemaModel: SchemaModel =
      originalModel.current[
        modelType === "capture" ? "capture_body" : "schema"
      ];

    // Set the rows in the table
    const schemaRows: {
      [key: string]: {
        key: string;
        value: string;
      };
    } = {};

    const rowOrder: Array<string> = [];
    for (const row of Object.values(schemaModel)) {
      schemaRows[row.id] = {
        key: `${row.id}-key`,
        value: `${row.id}-value`,
      };

      rowOrder.push(row.id);
    }

    cellListRef.current.rowOrder = rowOrder;
    cellListRef.current.schemaRows = {
      ...schemaRows
    }
  }, [resetSchemaRows]);

  const modelKeys = useMemo(() => {
    return Object.keys(modelObject[modelType]);
  }, [modelType]);

  /* Track whether already called hook once */
  const initializedRef = useRef(false);
  const reducerObjectRef = useRef<ReducerObject>(null);

  if (!initializedRef.current) {
    initializedRef.current = true;

    reducerObjectRef.current = {
      /**
       * Replace value of schema model
       * @param {string} key property name of schema object
       * @param {string | SchemaModel} content property value of schema object
       * @returns {void}
       */
      update(key: string, content: string | SchemaModel): void {
        if (!modelKeys.includes(key)) return;

        // If update to url, we must check if it is substring of the url of the current page
        // A user cannot edit or create a schema for a page which doesn't match to the
        // Page they are currently on.

        if (key === "url_match") {
          // Do not update form model
          if (!currentURL.includes(content)) return;
        }
        // Check if capture or schema
        setModel((prevState: Capture | Schema) => {
          return {
            ...prevState,
            [key]: content,
          };
        });
      },
      /**
       *
       * @returns {Schema | Capture}
       */
      read(): Schema | Capture {
        return model;
      },
      reset(formModel?: Schema | Capture) {
        if (!formModel) {
          setModel(JSON.parse(JSON.stringify(originalModel.current)));
          reducerObjectRef.current?.addNewRow()
          return;
        }

        // Reset original model
        originalModel.current = JSON.parse(JSON.stringify(formModel));

        setModel(JSON.parse(JSON.stringify(formModel)));

        // Reset schema rows tracker
        setReset(prev=>!prev)

        reducerObjectRef.current?.moveFocusedCell('last')

      },

      /**
       * Capture body or schema SchemaMode Methods
       */

      /**
       * Add new row to schema Model
       */
      addNewRow() {
        // New SchemaEntry id
        let newId = crypto.randomUUID();

        // Use callback instead to work with most recent model state
        setModel((prevModel) => {
          const updatedModel = JSON.parse(JSON.stringify(prevModel));

          // Check if id already exists on current model
          while (updatedModel[objectType][newId]) {
            newId = crypto.randomUUID();
          }
          // Add schema entry to model
          updatedModel[objectType][newId] = {
            ...JSON.parse(JSON.stringify(schemaEntry)),
            id: newId,
          };

          return updatedModel;
        });
        /**
         * Update cell list ref
         */

        // Update number of rows
        cellListRef.current.rowOrder.push(newId);

        // Add new row entry
        cellListRef.current.schemaRows[newId] = {
          key: `${newId}-key`,
          value: `${newId}-value`,
        };

        cellListRef.current.currentRow = newId;

        // Focus on cell on next row
        reducerObjectRef.current?.focusOnCell(`${newId}-key`);
      },

      /**
       * Delete SchemaEntry in SchemaModel using SchemaEntry id
       * @param entryId
       */
      deleteRow(entryId: string) {
        setModel((prevState) => {
          const updatedModel = JSON.parse(JSON.stringify(prevState));

          /**
           *  Delete row from object model...
           */
          delete updatedModel[objectType][entryId];

          return updatedModel;
        });

        /**
         * Update cell list
         */

        // Get previous entry id
        const deletedEntryIdIndex = cellListRef.current.rowOrder.findIndex(
          (value) => {
            if (value === entryId) return true;
          }
        );

        // fix logic later
        if (deletedEntryIdIndex === 0) return;

        // Get previous entry id
        const prevEntryId =
          cellListRef.current.rowOrder[deletedEntryIdIndex - 1];

        // Set current highlighted cell
        cellListRef.current.focusedCell = `${prevEntryId}-key`;

        // Delete deleted entry id
        cellListRef.current.rowOrder.splice(deletedEntryIdIndex, 1);
        delete cellListRef.current.schemaRows[entryId];

        // Set focussed cell state
        setFocusedCell(cellListRef.current.focusedCell);
      },
      /**
       * Highlight cell in schema form table on side panel
       */
      focusOnCell(cellId: string) {
        setFocusedCell(cellId);

        const entryId = cellId.includes("-key")
          ? cellId.replace("-key", "")
          : cellId.replace("-value", "");
        cellListRef.current.focusedCell = cellId;
        cellListRef.current.currentRow = entryId;
      },
      /**
       * Accept a command to programmatically
       * change focused cell position
       * @param {string}command
       */
      moveFocusedCell(command: string) {
        switch (command) {
          case "next":
            {
              /**
               * Check if key cell -- move to value cell
               */
              const currentCellId = cellListRef.current.focusedCell;
              if (currentCellId.includes("key")) {
                const currentCellIdReplace = currentCellId.replace(
                  "key",
                  "value"
                );
                cellListRef.current.focusedCell = currentCellIdReplace;

                setFocusedCell(currentCellIdReplace);

                return;
              }

              /**
               * Get current focused row index
               */
              const currentRowIndex = cellListRef.current.rowOrder.findIndex(
                (value) => {
                  if (value === cellListRef.current.currentRow) return true;
                }
              );

              // Create new row if newRowEntryId is undefined
              if (cellListRef.current.rowOrder.length < currentRowIndex + 2) {
                reducerObjectRef.current?.addNewRow();
                return;
              }
              /**
               * Get next row index
               */
              const nextRowIndex = currentRowIndex + 1;

              /**
               * Get net row entry id
               */
              const nextEntryId = cellListRef.current.rowOrder[nextRowIndex];

              // Get schema row
              const nextSchemaRow = cellListRef.current.schemaRows[nextEntryId];
              setFocusedCell(nextSchemaRow.key);

              // Update cell list ref
              cellListRef.current.focusedCell = nextSchemaRow.key;
              cellListRef.current.currentRow = nextEntryId;
            }
            break;
          case "last":
            {
              /**
               * Get last row entry id
               */
              const lastRowId = cellListRef.current.rowOrder[cellListRef.current.rowOrder.length- 1];

              /**
               * set current row
               */
              cellListRef.current.currentRow = lastRowId;
              cellListRef.current.focusedCell = `${lastRowId}-key`

          
              setFocusedCell(`${lastRowId}-key`);
            }
            break
        }
      },
      updateCurrentCell(domOptions: SendDOMDataOptions) {
        // Highlighted row id and cell id
        const currentRowId = cellListRef.current.currentRow;
        const focusedCell = cellListRef.current.focusedCell;

        //Update model
        setModel((prevState: Capture | Schema) => {
          const updatedModel = { ...prevState };

          // Get Schema Entry highlighted
          const currentEntry: SchemaEntry =
            updatedModel[objectType][currentRowId];

          // Get key or value
          const keyOrValue = focusedCell.includes("-key") ? "key" : "value";

          const schemaEntryDataPoint = currentEntry[keyOrValue];

          // update values
          schemaEntryDataPoint.match_expression =
            domOptions.data.matchExpression;
          schemaEntryDataPoint.match_type = domOptions.data.matchType;
          schemaEntryDataPoint.matched_value = domOptions.data.matchValue;

          // Update object
          currentEntry[keyOrValue] = schemaEntryDataPoint;

          updatedModel[objectType][currentRowId] = currentEntry;

          // Return deeply copied object
          return JSON.parse(JSON.stringify(updatedModel));
        });

        // Move to next cell
        reducerObjectRef.current?.moveFocusedCell("next");
      },
    };

    // For create_schema action, Set the url match to the current url
    if (!existingModel) {
      reducerObjectRef.current.update("url_match", currentURL);
      reducerObjectRef.current.update("id", crypto.randomUUID());
    }
  }

  // Throw error  if failed to create reducerObject
  if (!reducerObjectRef.current)
    throw new Error("Failed to initiate reducerObject");

  return [model, reducerObjectRef.current, focusedCell];
};

const schemaModel: Schema = {
  url_match: "",
  id: "",
  schema: {},
  name: "",
};

const captureModel: Capture = {
  name: "",
  project_id: "",
  url_match: "",
  schema_id: "",
  id: "",
  date_created: "",
  capture_body: {},
  last_edited: "",
};

const schemaEntry: SchemaEntry = {
  id: "",
  key: {
    match_expression: "",
    match_type: "manual",
    matched_value: "",
  },
  value: {
    match_expression: "",
    match_type: "id",
    matched_value: "",
  },
};

const modelObject = {
  schema: schemaModel,
  capture: captureModel,
};
