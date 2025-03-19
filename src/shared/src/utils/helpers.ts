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
  const valid_value_types = ["string", 'object'];

  if (typeof entryToValidate !== "object")
    throw new TypeError("Schema not an object");

  const { key, value } = entryToValidate;
  // Validate schema key value and value match value
  if (
    (key.matched_value?.length ?? 0) > 20 ||
    !valid_value_types.includes(typeof key.matched_value)
  ) {
    throw new Error(
      "Schema key name invalid - must be a string of 20 characters or less"
    );
  }

  if (
    (value.matched_value?.length ?? 0) > 20 ||
    !valid_value_types.includes(typeof value.matched_value)
  ) {
    throw new Error(
      "Schema value invalid - must be a string of 20 characters or less"
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
    (key.match_expression?.length ?? 0) > 20 ||
    !valid_value_types.includes(typeof key.match_expression)
  ) {
    throw new Error(
      "Schema key match expression invalid - must be a string of 20 characters or less"
    );
  }

  if (
    (value.match_expression?.length ?? 0) > 20 ||
    !valid_value_types.includes(typeof value.match_expression)
  ) {
    throw new Error(
      "Schema value match expression invalid - must be a string of 20 characters or less"
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
  const dataTypes = ["project", "schema", "capture"];
  if (typeof type !== "string" || !dataTypes.includes(type))
    throw new TypeError("CRUD operation data type value incorrect");

  // Check method
  const methods = ["create", "update", "read", "delete"];
  if (typeof method !== "string" || !methods.includes(method))
    throw new TypeError("CRUD operation method value incorrect");

  // Validate data
  validateData(type, data);
}

// HELPERS - REFACTOR - MOVE INTO SEPARATE MODULE WITH OTHER  VALIDATION FUNCTIONS
export function messageFactory(
  operation: string,
  messageData?: CRUDDataOptions
): BackendMessage {
  switch (operation) {
    case "database":

    if(!messageData) throw new Error("CRUD OPtions data required for db operation")
      return {
        operation: operation,
        data: messageData,
      };
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
