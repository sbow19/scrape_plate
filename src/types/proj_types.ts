declare global {
  // User Content Tree Model
  type UserContentModel = {
    details: {
      // Has user used extension once before
      hasUsedOnce: boolean;
      // Last used - represents date time string
      last_used: string;

      username: string;

      // Inform user of version updates
      updateRequired: boolean;

      currentProject: ProjectId
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
    id: ProjectId; ///uuid.v4()
    captures: {
      [key: string]: Capture; // keys represent either date taken with url, or a given name
    };
  };

  type Capture = {
    id: string;
    date_created: string;
    last_edited: string;
    schema_id: SchemaId;
    project_id: ProjectId
    name: string;
    capture_body: {
      [key: string]: SchemaEntry; // Key represents the corresponding key in schema
    };
  };
  type SchemaId = string;
  type ProjectId = string;

  // Options
  type SearchOptions = {
    type: string;
    term: string;
  };

  type CRUDDataOptions =
    | { method: "create" | "update" ; type: "capture"; data: Capture }
    | { method: "create" | "update" ; type: "project"; data: ProjectGroup }
    | { method: "create" | "update" ; type: "schema"; data: Schema }
    | { method: "delete" ; type: "schema" | "project"; data: string}
    | { method: "delete" ; type: "capture"; data: {
      project_id: string
      id: string
    }}
    

  // Define conditional data structures for different operations

  /**
   * Responses
   */
  type BackendResponseOptions = {
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

  type BackendResponse =
    | { operation: "database"; data: BackendResponseOptions["data"] }
    | {
        operation: "otherOperation";
        data: BackendResponseOptions["otherOperation"];
      };

  /**
   * Messages
   */
  type BackendMessageOptions = {
    data: CRUDDataOptions
    otherOperation: {
      otherField: string;
      success: boolean;
    };
  };

  type BackendMessage =
    | { operation: "database"; data: BackendMessageOptions["data"] }
    | {
        operation: "otherOperation";
        data: BackendMessageOptions["otherOperation"];
      };
}

export {};
