declare global {
  // User Content Tree Model
  type UserContentModel = {
    details: UserContentDetails;
    projects: {
      [key: string]: ProjectGroup; // Keys represent the name or the project group
    };
    schemas: {
      [key: SchemaId]: Schema;
    };
  };

  type UserContentDetails = {
    // Has user used extension once before
    hasUsedOnce: boolean;
    // Last used - represents date time string
    last_used: string;

    username: string;

    // Inform user of version updates
    updateRequired: boolean;

    currentProject: ProjectId | null;
  };

  type Schema = {
    id: SchemaId;
    name: string | null;
    url_match: string; // Schemas must match a specific url pattern
    schema: {
      [key: string]: SchemaEntry; // Key must be name of the key
    };
  };

  type SchemaEntry = {
    key: {
      match_expression: string | null; // Represents match term
      match_type: MatchMethod; // Represents the methods for determining the key value, which can be done manually
      matched_value: string | null; // Represents the actual scraped value
    };
    value: {
      match_expression: string | null;
      match_type: "id" | "css selector" | "regex";
      matched_value: string | null; // Represents the actual scraped value
    };
  };

  type MatchMethod = "id" | "css selector" | "regex" | "manual";

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
    project_id: ProjectId;
    url_match: string;
    name: string;
    capture_body: {
      [key: string]: SchemaEntry; // Key represents the key value of the entry
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
    | { method: "read"; type: "all" | "schema" | "schemaMatches" }
    | { method: "update"; type: "schemaMatches"; data: Schema[] }
    | { method: "create" | "update"; type: "capture"; data: Capture }
    | { method: "create" | "update"; type: "project"; data: ProjectGroup }
    | { method: "create" | "update"; type: "schema"; data: Schema }
    | {
        method: "delete";
        type: "schema" | "project";
        data: SchemaId | ProjectId;
      }
    | {
        method: "delete";
        type: "capture";
        data: {
          project_id: ProjectId;
          id: string;
        };
      }
    | { method: "update"; type: "details"; data: UserContentDetails };

  // Define conditional data structures for different operations

  /**
   * Responses
   */
  type BackendResponseOptions = {
    data: {
      type: DBOperationDataType;
      method: DBOperations;
      success: boolean;
      message: DBErrorMessage | string | null;
      payload: any; // Represents content if requested
    };

    /**
     * Specify the page to display -- view/edit, create schema, capture
     */
    openSidePanel: {
      method: "view_edit" | "create_schema" | "capture_body";
      schema: Schema | Array<Schema>; // Matching schema or schemas
    };
  };

  type BackendResponse =
    | {
        operation: "database";
        data: BackendResponseOptions["data"];
      }
    | {
        operation: "openSidePanel";
        data: BackendResponseOptions["openSidePanel"];
      };

  /**
   * Messages
   */
  type BackendMessageOptions = {
    data: CRUDDataOptions;
    openSidePanel: {
      method: "view_edit" | "create_schema" | "capture_body";
      schema: Schema | Schema[];
    };
    otherOperation: {
      otherField: string;
      success: boolean;
    };
  };

  type BackendMessage =
    | { operation: "database"; data: BackendMessageOptions["data"] }
    | {
        operation: "openSidePanel";
        data: BackendMessageOptions["openSidePanel"];
      }
    | {
        operation: "otherOperation";
        data: BackendMessageOptions["otherOperation"];
      };

  /**
   * INTERNAL  DATABASE OPERATIONS
   */
  type DBOperationResult = {
    success: boolean;
    method: DBOperations;
    type: DBOperationDataType;
    message: DBErrorMessage | null;
    data?:
      | UserContentModel
      | {
          [key: string]: Schema;
        };
  };

  type DBOperations = "read" | "update" | "delete" | "create";
  type DBOperationDataType =
    | "details"
    | "schema"
    | "project"
    | "capture"
    | "all"
    | "other"
    | "schemaMatches";

  type DBErrorMessage =
    | "Invalid data type"
    | "Object stores could not be fetched"
    | "Delete project request failed"
    | "Delete schema request failed"
    | "Get operation on projects store failed"
    | "Capture id does not exist"
    | "Create project request failed"
    | "Create schema request failed"
    | "Capture id already exists"
    | "Invalid DB method"

    // DOM Exceptions
    | DOMException
    | "InvalidStateError"
    | "TransactionInactiveError";

  /**
   * Misc Types
   */
  type SchemaMatches = {
    schemaMatches: Schema[];
  };

  /**
   * Prop Types
   */
  type IconProps = {
    height: number;
    width: number;
    title: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    /**
     * Fill of svg line paths enclosed space fill
     */
    pathFill?: string;
    /**
     * Stroke colour
     */
    strokeColor?: string;
    /**
     * Background
     */
    svgFill?: string;
  };

  type AppButtonProps = {
    onClick?: MouseEventHandler<HTMLButtonElement>;
    children: ReactNode;
    textStyle?: {};
    buttonStyle?: {};
    title: string;
  };

  type AppTableProps = {
    tableData: TableData | null;
    options: TableOptions;
  };

  type TableData = {
    header: Array<string>;
    data: Array<Array<string>>;
  };

  type TableOptions = {
    enableDelete: boolean;
    enableEdit: boolean;
    enableInLineEdit: boolean
    dataType: DBOperationDataType
    id: string
  };


  type TableDataTypeOptions =
  | "projectList"
  | "project"
  | "captureList"
  | "capture"
  | "schemaList"
  | "schema"
  | "schemaMatchList";

  }

  type ToastState = {
    open: boolean,
    text: HTMLParagraphElement,
    buttons: Array<()=>{}>,
    timer?: number  
  };

export {};
