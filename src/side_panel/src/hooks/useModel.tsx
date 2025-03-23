import { useMemo, useRef, useState } from "react";

/**
 * Manages the state of a form in the side panel view.
 *
 * E.g., for a create schema operation, the user will edit
 * the name, url_match, and schemaEntries, so this hook keeps track.
 *
 * @param {ModelTypes} modelType Describes whether modelling Schema or Capture data
 * @param {Schema | Capture} model Optional model to initialise, such as  with editing schema
 */
export const useModel = (
  modelType: ModelTypes,
  existingModel?: Schema | Capture
): [Schema | Capture, ReducerObject] => {
  if (!["schema", "capture"].includes(modelType)) {
    throw new Error("Incorrect model type for useModel hook");
  }

  // Keep ref to original model for reset
  const originalModel = useRef(null)
  
  
  /* CREATE BLANK MODEL OR COPY OF EXISITNG MODEL */
  const [model, setModel] = useState(
    existingModel ? JSON.parse(JSON.stringify(existingModel)) : { ...modelObject[modelType] }
  );

  const modelKeys = useMemo(() => {
    return Object.keys(modelObject[modelType]);
  }, [modelType]);
  /* Track whether already called hook once */
  const initialsedRef = useRef(false);
  const reducerObjectRef = useRef<ReducerObject>({});


  if (!initialsedRef.current) {
    initialsedRef.current = true;

    // Deeply clone the existing model
    originalModel.current = JSON.parse(JSON.stringify(existingModel))

    reducerObjectRef.current = {
      modelKeys,
      update(key: string, content: any) {
        if (!reducerObjectRef.current.modelKeys.includes(key)) return;

        // If update to url, we must chec if it is substring of the url of the current page
        // A user cannot edit or create a schema for a page which doesnt correspond to the
        // Page they are currently on
        
        // Check if capture or schema
        setModel((prevState) => ({
          ...prevState,
          [key]: content,
        }));
      },
      /**
       * Warning, only to use on top level keys. Nested object updates
       * such as capture keys, should be updated using the update method
       * to update the entire capture without the key
       * @param key
       * @param content
       * @returns
       */
      delete(key: string, content: any) {
        if (!reducerObjectRef.current.modelKeys.includes(key)) return;

        setModel((prevState) => ({
          ...prevState,
          [key]: "",
        }));
      },
      read() {
        return model;
      },
      create(key: string, content: any) {
        if (!reducerObjectRef.current.modelKeys.includes(key)) return;

        setModel((prevState) => ({
          ...prevState,
          [key]: content,
        }));
      },
      reset() {
        setModel(JSON.parse(JSON.stringify(originalModel.current)))
      }
    };
  }

  return [model, reducerObjectRef.current];
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

const modelObject = {
  schema: schemaModel,
  capture: captureModel,
};
