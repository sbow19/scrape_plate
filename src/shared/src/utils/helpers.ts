/**
 * Validation functions, message factories etc
 */
import UserContent from "../state/state";

/**
 * Validates data provided as Captures, Schemas, or Projects.
 * Each switch block  validates key value: value pair in the provided data
 * @param dataType
 * @param data
 */
export function validateData(
  dataType: string,
  data: Schema | Capture | ProjectGroup
) {
  switch (dataType) {
    case "project":
      {
        // Test key validity
        const projectGroupKeys = [
          "name",
          "last_edited",
          "date_created",
          "id",
          "captures",
        ];
        for (const key of Object.keys(data)) {
          if (!projectGroupKeys.includes(key))
            throw new TypeError(
              `ProjectGroup object does not contain ${key} key`
            );
        }

        // Test values
        for (const [key, value] of Object.entries(data)) {
          switch (key) {
            case "name":
              {
                if (typeof value !== "string")
                  throw new TypeError("Project name not a string");

                // TEST PROJECT NAME LENGTH
                if (value.length > 20)
                  throw new Error(
                    "Project name must be less than 20 characters"
                  );
              }
              break;
            case "last_edited":
              if (typeof value !== "string")
                throw new TypeError("Project last edited not a string");
              break;
            case "date_created":
              if (typeof value !== "string")
                throw new TypeError("Project created data not a string");
              break;
            case "id":
              if (typeof value !== "string")
                throw new TypeError("Project id not a string");
              break;
            case "captures":
              if (typeof value !== "object")
                throw new TypeError("captures not an object");
              break;
          }
        }
      }
      break;
    case "capture":
      {
        // Test key validity
        const captureKeys = [
          "name",
          "last_edited",
          "date_created",
          "project_id",
          "id",
          "capture_body",
          "schema_id",
          "url_match",
        ];
        for (const key of Object.keys(data)) {
          if (!captureKeys.includes(key))
            throw new TypeError(`Capture object does not contain ${key} key`);
        }

        // Test values
        for (const [key, value] of Object.entries(data)) {
          switch (key) {
            case "name":
              if (typeof value !== "string")
                throw new TypeError("Capture  name not a string");

              if (value.length > 20)
                throw new Error("Capture name must be less than 20 characters");

              break;
            case "last_edited":
              if (typeof value !== "string")
                throw new TypeError("Capture  last edited not a string");
              break;
            case "date_created":
              if (typeof value !== "string")
                throw new TypeError("Capture  created data not a string");
              break;
            case "id":
              if (typeof value !== "string")
                throw new TypeError("Capture id not a string");
              break;
            case "url_match":
              if (typeof value !== "string")
                throw new TypeError("Capture url match not a string");
              break;
            case "capture_body":
              Object.values(value).forEach((entry: SchemaEntry) => {
                validateSchemaEntry(entry);
              });

              break;
            case "schema_id": {
              if (typeof value !== "string")
                throw new TypeError("captures schema_id not an string");

              // Test Schema id exists in schemas list
              const schemaIdList = Object.keys(
                UserContent._userContentModel["schemas"]
              );

              if (!schemaIdList.includes(value)) {
                throw new Error("Capture schema id does not exist");
              }
              break;
            }
            case "project_id": {
              if (typeof value !== "string")
                throw new TypeError("captures project_id not an string");

              // Test Schema id exists in schemas list
              const projectsList = Object.values(
                UserContent._userContentModel["projects"]
              ).flat();

              const project = projectsList.find((project) => {
                if (project.id === value) return true;
              });

              if (!project)
                throw new Error("Capture project id does not exist");
              break;
            }
            default:
              break;
          }
        }
      }
      break;
    case "schema":
      {
        // Test key validity
        const schemaKeys = ["name", "id", "url_match", "schema"];
        for (const key of Object.keys(data)) {
          if (!schemaKeys.includes(key))
            throw new TypeError(`Schema object does not contain ${key} key`);
        }

        // Test values
        for (const [key, value] of Object.entries(data)) {
          switch (key) {
            case "name":
              if (typeof value !== "string" && value !== null)
                throw new TypeError("Schema  name not a string or null value");
              if (value.length > 20)
                throw new Error("Schema name must be less than 20 characters");

              break;
            case "id":
              if (typeof value !== "string")
                throw new TypeError("Schema id not a string");
              break;
            case "schema":
              // Throws error if  fails to validate
              Object.values(value).forEach((entry: SchemaEntry) => {
                validateSchemaEntry(entry);
              });
              break;
            case "url_match":
              if (typeof value !== "string")
                throw new TypeError("Schema url match not a string");
              break;
          }
        }
      }
      break;
  }
}

/**
 * Validates schema entries and capture entries/bodies
 * @param entryToValidate
 */
export function validateSchemaEntry(entryToValidate: SchemaEntry) {
  // Match types
  const matched_types = ["id", "css selector", "manual", "regex "];
  const valid_value_types = ["string", "object"];

  if (!entryToValidate.id) {
    throw new TypeError("Schema must contain an id");
  }

  if (typeof entryToValidate !== "object")
    throw new TypeError("Schema not an object");

  const { key, value } = entryToValidate;
  // Validate schema key value and value match value
  if (
    (key.matched_value?.length ?? 0) > 256 ||
    !valid_value_types.includes(typeof key.matched_value)
  ) {
    throw new Error(
      "Schema key name invalid - must be a string of 100 characters or less"
    );
  }

  if (
    (value.matched_value?.length ?? 0) > 256 ||
    !valid_value_types.includes(typeof value.matched_value)
  ) {
    throw new Error(
      "Schema value invalid - must be a string of 100 characters or less"
    );
  }

  // Validate the match types
  if (!matched_types.includes(key.match_type)) {
    throw new Error(
      "Schema key match type invalid - must be regex, id, or css selector"
    );
  }

  if (!matched_types.includes(value.match_type)) {
    throw new Error(
      "Schema value match type invalid - must be regex, id, or css selector"
    );
  }

  // Validate the match expression
  if (
    (key.match_expression?.length ?? 0) >256 ||
    !valid_value_types.includes(typeof key.match_expression)
  ) {
    throw new Error(
      "Schema key match expression invalid - must be a string of 256 characters or less"
    );
  }

  if (
    (value.match_expression?.length ?? 0) > 256 ||
    !valid_value_types.includes(typeof value.match_expression)
  ) {
    throw new Error(
      "Schema value match expression invalid - must be a string of 256 characters or less"
    );
  }
}

/**
 * Validates options provided for making CRUD operations
 * @param options
 */
export function validateCRUDOptions(options: CRUDDataOptions): void {
  // Check keys are correct
  const keys = ["method", "data", "type"];

  for (const property of Object.keys(options)) {
    if (!keys.includes(property))
      throw new TypeError("CRUD options have incorrect keys");
  }

  // Check CRUD options conform to correct type
  const { type, method, data } = options;

  // Check data type
  const dataTypes = ["project", "schema", "capture", "details", "captureRow"];
  if (typeof type !== "string" || !dataTypes.includes(type))
    throw new TypeError("CRUD operation data type value incorrect");

  // Check method
  const methods = ["create", "update", "read", "delete"];
  if (typeof method !== "string" || !methods.includes(method))
    throw new TypeError("CRUD operation method value incorrect");

  // Validate data
  validateData(type, data);
}

/**
 * Generate backend messages
 *
 */

export function messageFactory(
  operation: "database",
  message: CRUDDataOptions
): BackendMessage;
export function messageFactory(
  operation: "openSidePanel",
  message: OpenSidePanelOptions
): BackendMessage;
export function messageFactory(
  operation: "otherOperation",
  message: { otherField: any; success: boolean }
): BackendMessage;
export function messageFactory(operation: "getCurrentTab"): BackendMessage;
export function messageFactory(operation: "sendDOMData", message: SendDOMDataOptions): BackendMessage;
export function messageFactory(
  operation: BackendOperation,
  messageData?: any
): BackendMessage {
  switch (operation) {
    case "database":
      if (!messageData)
        throw new Error("CRUD Options data required for db operation");
      return {
        operation: operation,
        data: messageData,
      };
    case "openSidePanel":
      if (!messageData)
        throw new Error("OpenSidePanelOptions required to open side panel");
      return {
        operation: operation,
        data: messageData,
      };
    case "getCurrentTab":
      return {
        operation: operation,
        data: '',
      };
    case "sendDOMData":
      if (!messageData)
        throw new Error("DOM Data required to send DOM Message");
      return {
        operation: "sendDOMData",
        data: messageData
      }
     

    case "otherOperation":
      return {
        operation: operation,
        data: {
          otherField: "",
          success: false,
        },
      };
    default:
      throw new TypeError("Message operation type incorrect - e.g. database");
  }
}

// UI HELPERS

/**
 *
 */
export function tableDataConverter(
  type: "projectList",
  data: ProjectGroup[]
): TableData | null;
export function tableDataConverter(
  type: "project",
  data: ProjectGroup
): TableData | null;
export function tableDataConverter(
  type: "captureList",
  data: Capture[]
): TableData | null;
export function tableDataConverter(
  type: "capture",
  data: Capture
): TableData | null;
export function tableDataConverter(
  type: "schemaList",
  data: Schema[]
): TableData | null;
export function tableDataConverter(
  type: "schema",
  data: SchemaEntry[]
): TableData | null;
export function tableDataConverter(
  type: "schemaMatchList",
  data: Schema[]
): TableData | null;

/**
 *
 * @param type      // Determines headers and data parsing
 * @param data
 * @returns Table data is an object with a header property and data property
 *
 * The data property contains an array of arrays (list of rows of datapoints).
 * Each row of data is itself and array. For each row of data, the first index is
 * reserved for the id representing the item for that row. This id is used for
 * edit and delete operations.
 *
 */
export function tableDataConverter(
  type: TableDataTypeOptions,
  data: any
): TableData | null {
  switch (type) {
    case "captureList": {
      return {
        header: ["Name", "URL", "Date Captured"],
        data: data.map((capture: Capture) => {
          return [
            capture.id,
            capture.name,
            capture.url_match,
            convertISOToDate(capture.date_created),
          ];
        }),
      };
    }
    case "capture":
      return {
        header: ["Key", "Value"],
        data: data.map((capture: SchemaEntry) => {
          return [capture.id, capture.key.matched_value, capture.value.matched_value];
        }),
      };
    case "projectList":
      return {
        header: ["Name", "Date Created", "Last Edited"],
        data: data.map((project: ProjectGroup) => {
          return [
            project.id,
            project.name,
            convertISOToDate(project.date_created),
            convertISOToDate(project.last_edited),
          ];
        }),
      };
    case "schemaMatchList": {
      const dataTyped = data as Schema[];
      return {
        header: ["Name", "URL Match"],
        data: dataTyped.map((schema) => {
          return [schema.id, schema.name, schema.url_match];
        }),
      };
    }
    case "schemaList":
      return {
        header: ["Name", "URL_Match"],
        data: data.map((schema: Schema) => {
          return [schema.id, schema.name, schema.url_match];
        }),
      };
    /**
     *
     */
    case "schema":
      return {
        header: ["Key", "Type", "Value", "Type"],
        data: data.map((schema: SchemaEntry) => {
          return [
            schema.id,
            schema.key?.match_type === "manual"
              ? schema.key.matched_value
              : schema.key.match_expression,
            schema.key.match_type,
            schema.value.match_expression,
            schema.value.match_type,
          ];
        }),
      };

    default:
      return null;
  }
}

export function convertISOToDate(date: string): string | null {
  if (!date) return null;
  const newDate = new Date(date);
  return `${newDate.getDate()} ${
    monthMatch[newDate.getMonth()]
  } ${newDate.getFullYear()}`;
}

/**
 * Experimental. Recusively go through object
 * @param targObj
 */
export function deepClone(
  targObj: object | null,
  resultObj: object
): object | null {
  if (targObj === null) return null;

  Object.entries(targObj).forEach((entry) => {
    // Set key on result Obj
    resultObj[entry[0]] = null;
    const value = entry[1];

    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      resultObj[entry[0]] = {};
      deepClone(value, resultObj[entry[0]]);
    } else if (Array.isArray(value)) {
      resultObj[entry[0]] = [];

      arrayClone(value, resultObj[entry[0]]);
    } else {
      resultObj[entry[0]] = entry[1];
    }
  });
  return resultObj;
}

function arrayClone(arr: any[], resAr: any[]) {
  arr.forEach((val) => {
    if (Array.isArray(val)) {
      const newAr: any[] = [];
      arrayClone(val, newAr);
      resAr.push(newAr);
    } else if (val !== null && typeof val === "object") {
      const newObj = {};
      deepClone(val, newObj);
      resAr.push(newObj);
    } else {
      resAr.push(val);
    }
  });

  return resAr;
}

const monthMatch: {
  [key: number]: string;
} = {
  0: "January",
  1: "February",
  2: "March",
  3: "April",
  4: "May",
  5: "June",
  6: "July",
  7: "August",
  8: "September",
  9: "October",
  10: "November",
  11: "December",
};
