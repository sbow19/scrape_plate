declare global {
  // User Content Tree Model
  type UserContentModel = {
    details: {
      // Has user used extension once before
      hasUsedOnce: boolean;
      // Last used - represents date time string
      last_used: string;

      username: string;
    };
    projects: {
      [key: string]: ProjectGroup; // Keys represent the name or the project group
    };
    schemas: {
      [key: SchemaId]: Schema;
    };
  };

  type Schema = {
    id: SchemaId;
    name: string | null;
    url_match: string; // Schemas must match a specific url pattern
    schema: {
      [key: string]: SchemaEntry; // Key must represent a RegExp match, css selector or id
    };
  };

  type SchemaEntry = {
    match: string | null;
    match_type: "id" | "css selector" | "regex";
  };

  type ProjectGroup = {
    name: string;
    date_created: string;
    last_edited: string;
    id: string; ///uuid.v4()
    captures: {
      [key: string]: Capture; // keys represent either date taken with url, or a given name
    };
  };

  type Capture = {
    id: string;
    date_created: string;
    last_edited: string;
    schema_id: SchemaId;
    project_id: string
    name: string;
    capture_body: {
      [key: string]: SchemaEntry; // Key represents the corresponding key in schema
    };
  };
  type SchemaId = string;

  // Options
  type SearchOptions = {
    type: string;
    term: string;
  };

  type CRUDDataOptions =
    | { method: "create" | "update" | "read" | "delete"; type: "capture"; data: Capture }
    | { method: "create" | "update" | "read" | "delete"; type: "project"; data: ProjectGroup }
    | { method: "create" | "update" | "read" | "delete"; type: "schema"; data: Schema };

  // Define conditional data structures for different operations

  /**
   * Responses
   */
  type DatabaseResponseOptions = {
    data: {
      type: "project" | "capture" | "schema";
      method: "create" | "update" | "read" | "delete";
      success: boolean;
      message?: string
    };
    otherOperation: {
      otherField: string;
      success: boolean;
    };
    // Add more operations as needed...
  };

  type DatabaseResponse =
    | { operation: "database"; data: DatabaseResponseOptions["data"] }
    | {
        operation: "otherOperation";
        data: DatabaseResponseOptions["otherOperation"];
      };

  /**
   * Messages
   */
  type DataBaseMessageOptions = {
    data: CRUDDataOptions
    otherOperation: {
      otherField: string;
      success: boolean;
    };
  };

  type DatabaseMessage =
    | { operation: "database"; data: DataBaseMessageOptions["data"] }
    | {
        operation: "otherOperation";
        data: DataBaseMessageOptions["otherOperation"];
      };
}

export {};
