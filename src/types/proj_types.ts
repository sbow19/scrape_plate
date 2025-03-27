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
      [key: string]: SchemaEntry; // Key represents the id of the schema entry
    };
  };

  type SchemaEntry = {
    id: string      
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
      [key: string]: Capture; // Keys are the ids of the capture
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
      [key: string]: SchemaEntry; // Key represents the id of the capture body
    };
  };
  type SchemaId = string;
  type ProjectId = string;

  // Options
  type SearchOptions = {
    type: 'project' | "schema" | "capture";
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
      method: "edit_schema" | "create_schema" | "edit_capture";
      schema: Schema | Array<Schema>; // Matching schema or schemas
    };

    getCurrentTab: chrome.tabs.Tab
  };

  type BackendResponse =
    | {
      operation: 'getCurrentTab'
      data: BackendResponseOptions['getCurrentTab']
    }
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
      method: "edit_schema" | "create_schema" | "edit_capture";
      schema: Schema | Schema[] | null | Capture;
      tab?: chrome.tabs.Tab
    };
    otherOperation: {
      otherField: string;
      success: boolean;
    };
  };

  type BackendMessage =
    | { operation: 'getCurrentTab'; data: ''}
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
    children: React.ReactNode;
    /**
     * Style the text directly with CSS style object
     */
    textStyle?: {};
    /**
     * Style the button itself with CSS style object
     */
    buttonStyle?: {};
    /**
     * Tooltip
     */
    title?: string;
  };

  type PopupTemplateProps = {
    contentComponent: React.ReactNode;
    secondaryActions: React.ReactNode;
    primaryAction: React.ReactNode;
    backButtonEnabled: boolean;
  };

  type AppTableProps = {
    tableData: TableData | null;
    options: TableOptions;
    resetTableData: React.Dispatch<React.SetStateAction<boolean>>
  };

  type ToastProps = {
    toastState: ToastState;
    setToastState: React.Dispatch<React.SetStateAction<ToastState>>;
  };

  type ButtonSliderProps = {
    selectorData: Array<[string, Array<React.ReactNode>]>;
  };

  type ButtonWrapperProps = {
    /**
     * Tooltip on hover
     */
    title: string
    children: React.ReactNode
    onClick: ()=> void
    /**
     * CSS Module outside button template
     */
    buttonStyle?: string       
  }

  type SchemaFormTemplateProps = {
    modelType: ModelTypes
    operation: 'create_schema' | 'edit_schema' | 'edit_capture'
    model: Schema | Schema[] | Capture | null
    currentURL: string
  }

  type SchemaFormProps = {
    formModel: Capture | Schema
    modelReducerObject:ReducerObject
  }

  type SchemaFormTableProps = {
    formModel: Capture | Schema
    operation: 'create_schema' | 'edit_schema' | 'edit_capture'
    modelReducerObject: ReducerObject
  }

  type TableData = {
    header: Array<string>;
    data: Array<Array<string>>;
    /**
     * List of rows of data points. First item in row considered id, and the second element the name
     *  */
  };

  type TableOptions = {
    enableDelete: boolean;
    enableEdit: boolean;
    enableSet: boolean;         // Set whether project is current project
    enableInLineEdit: boolean;
    dataType: DBOperationDataType;
  };

  type TableDataTypeOptions =
    | "projectList"
    | "project"
    | "captureList"
    | "capture"
    | "schemaList"
    | "schema"
    | "schemaMatchList";

  type ToastState = {
    open: boolean;
    text?: React.ReactNode;
    buttons?: Array<React.ReactNode>;
    timer?: number;
    timerCallback?: ()=>void
  };

  /**
   * HOOKS
   */

  //use Model hook
  type ModelTypes =  'schema' | 'capture'

  type ReducerObject = {
    modelKeys: Array<string>
    update: (
      key: string
      content: any
    )=>void 
    delete: (
      key: string
      content: any
    )=>void 
    create: (
      key: string
      content: any
    )=>void 
    read: ()=>Schema | Capture
    reset: ()=>void
  }
}

export {};
