/**
 * Class generates singleton object holding relevant user content
 * state. Other files can obtain content from this class from the useContent
 * hook
 */

import { testUserContentModelData } from "../tests/mock_data";
import { messageFactory, validateCRUDOptions } from "../utils/helpers";
import { EventEmitter } from "./events";

class UserContent {
  // Contains the user content in one js object, which is indirectly
  // accessible from hooks. IMPLEMENT: Content Model Type
  private static _userContentModel: UserContentModel;
  private static _schemaMatches: Schema[];
  private static _eventEmitter: EventEmitter = new EventEmitter();
  private static _hasLoaded: boolean =  false

  private static _testData: UserContentModel = testUserContentModelData;

  static init() {
    /**
     * Set up event listeners
     */

    // Fetch user content event
    UserContent._eventEmitter.subscribe("fetch", UserContent._fetchUserContent);

    // Get all user content in store
    UserContent._eventEmitter.subscribe(
      "getAll",
      UserContent._returnUserContent
    );
    UserContent._eventEmitter.subscribe("getAllOf", UserContent._returnAllOf);

    UserContent._eventEmitter.subscribe(
      "getMatchingSchemas",
      UserContent._returnMatchingSchemas
    );

    // Searches
    UserContent._eventEmitter.subscribe("search", UserContent._returnSearch);

    // Create
    UserContent._eventEmitter.subscribe("create", UserContent._createData);

    // Delete
    UserContent._eventEmitter.subscribe("delete", UserContent._deleteData);

    // Update
    UserContent._eventEmitter.subscribe("update", UserContent._updateData);

    // TESTING: set test data
    UserContent._eventEmitter.subscribe(
      "set_test_data",
      UserContent._setTestData
    );
  }

  // CRUD OPERATIONS

  /**
   * Fetch user content data from database
   * @returns User content model
   */
  private static async _fetchUserContent(): Promise<UserContentModel> {

    return new Promise((resolve, reject) => {
      try {
        const options: CRUDDataOptions = {
          method: "read",
          type: "all",
        };

        const backendMessage = messageFactory("database", options);
        chrome.runtime
          .sendMessage(backendMessage)
          .then((backendResponse: BackendResponse) => {

            if (backendResponse.operation !== "database")
              reject(backendResponse);

            if (!backendResponse.data.success) reject(backendResponse);


            // IMPLEMENT: validate user content model
            UserContent._userContentModel = backendResponse.data.payload;

            resolve(UserContent._userContentModel);

          })
          .catch((e) => {
            reject(e);
          });
      } catch {
        reject({});
      }
    });
  }

  /**
   *
   * @returns Entire user content model
   */
  private static _returnUserContent(): UserContentModel {
    return UserContent._userContentModel;
  }

  /**
   *
   * @returns
   */
  private static _returnMatchingSchemas(): Promise<Schema[]> {
    return new Promise((resolve, reject) => {
      try {
        const options: CRUDDataOptions = {
          method: "read",
          type: "schemaMatches",
        };

        const backendMessage = messageFactory("database", options);
        chrome.runtime
          .sendMessage(backendMessage)
          .then((backendResponse: BackendResponse) => {
            if (backendResponse.operation !== "database")
              reject(backendResponse);

            if (!backendResponse.data.success) reject(backendResponse);

            // IMPLEMENT: validate user content model
            UserContent._schemaMatches = backendResponse.data.payload;

            resolve(UserContent._schemaMatches);
          })
          .catch((e) => {
            reject(e);
          });
      } catch {
        reject({});
      }
    });
  }

  /**
   * @param {string} type // Subset of user content e.g. projects
   * @returns All of subset of user content - projects, schemas, and details. Captures cannot be returned this way
   *    */
  private static _returnAllOf(type: string): { [key: string]: any } {
    return UserContent._userContentModel[type];
  }

  /**
   *Search fo projects, captures, and schemas, with a name or id
   * with a matching substring on the search term
   * @param {SearchOptions} options   match by name or id, of all projects
   * @returns
   */
  private static _returnSearch(options: SearchOptions): any {
    // Type check options
    if (
      !options ||
      !Object.keys(options).includes("term") ||
      !Object.keys(options).includes("type")
    ) {
      throw new Error("Options require a term property and type property");
    }

    let results = []; // Matches
    let { term, type } = options;

    // term must be a string
    if (typeof term !== "string") {
      throw new TypeError("Term must be a string");
    }

    term = term.toLowerCase();

    switch (type) {
      case "project":
        // Match search term against project name and id
        results = Object.values(
          UserContent._userContentModel["projects"]
        ).filter((project) => {
          if (project.name.toLowerCase().includes(term.toLowerCase())) {
            return true;
          } else if (project.id === term) {
            return true;
          }
          return false;
        });
        return results;
      case "schema":
        // Match search term against schema name and id
        results = Object.values(
          UserContent._userContentModel["schemas"]
        ).filter((schema) => {
          if (
            schema.name &&
            schema.name.toLowerCase().includes(term.toLowerCase())
          ) {
            return true;
          } else if (schema.id === term) {
            return true;
          }
          return false;
        });
        return results;
      case "capture": {
        // Match search term against capture name and id
        const projects = Object.values(
          UserContent._userContentModel["projects"]
        );

        for (const project of projects) {
          Object.values(project.captures).forEach((capture) => {
            if (
              capture.name &&
              capture.name.toLowerCase().includes(term.toLowerCase())
            ) {
              results.push(capture);
            } else if (capture.id === term) {
              results.push(capture);
            } else if (capture.schema_id === term) {
              results.push(capture);
            }
          });
        }

        return results;
      }

      default:
        return null;
    }
  }


  /**
   * Search fo projects, captures, and schemas, with a name or id
   * matching the exact search term
   * @param {SearchOptions} options   match by name or id, of all projects
   * @returns
   */
  private static _returnExactSearch(options: SearchOptions): any {
    // Type check options
    if (
      !options ||
      !Object.keys(options).includes("term") ||
      !Object.keys(options).includes("type")
    ) {
      throw new Error("Options require a term property and type property");
    }

    let results = []; // Matches
    let { term, type } = options;

    // term must be a string
    if (typeof term !== "string") {
      throw new TypeError("Term must be a string");
    }

    term = term.toLowerCase();

    switch (type) {
      case "project":
        // Match search term against project name and id
        results = Object.values(
          UserContent._userContentModel["projects"]
        ).filter((project) => {
          if (project.name.toLowerCase() === term.toLowerCase()) {
            return true;
          } else if (project.id === term) {
            return true;
          }
          return false;
        });
        return results;
      case "schema":
        // Match search term against schema name and id
        results = Object.values(
          UserContent._userContentModel["schemas"]
        ).filter((schema) => {
          if (
            schema.name &&
            schema.name.toLowerCase() === term.toLowerCase()
          ) {
            return true;
          } else if (schema.id === term) {
            return true;
          }
          return false;
        });
        return results;
      case "capture": {
        // Match search term against capture name and id
        const projects = Object.values(
          UserContent._userContentModel["projects"]
        );

        for (const project of projects) {
          Object.values(project.captures).forEach((capture) => {
            if (
              capture.name &&
              capture.name.toLowerCase() === term.toLowerCase()
            ) {
              results.push(capture);
            } else if (capture.id === term) {
              results.push(capture);
            } else if (capture.schema_id === term) {
              results.push(capture);
            }
          });
        }

        return results;
      }

      default:
        return null;
    }
  }

  private static _createData(
    options: CRUDDataOptions
  ): Promise<BackendResponse> {
    // Validate create data options
    validateCRUDOptions(options);

    // Check for duplicates captures, project or
    let results = [] 
    if(["schema", "capture", "project"].includes(options.type)){
      results = UserContent._returnExactSearch(
        {
          type: options.type,
          term: options.data.name
        }
      ) 
    }

    // Compose background script message
    const backendMessage = messageFactory("database", options);

    //Determine data type and assign dates / unique ids
    let dataType;

    // Created time
    const currentTime = new Date();

    const d = currentTime.toISOString();

    // Id
    const id = crypto.randomUUID();

    switch (options.type) {
      case "capture":
        dataType = "captures";
        options.data.date_created = d;
        options.data.last_edited = d;
        options.data.id = id;
        break;
      case "project":
        dataType = "projects";
        options.data.date_created = d;
        options.data.last_edited = d;
        options.data.id = id;
        break;
      case "schema":
        dataType = "schemas";
        options.data.id = id;
        break;
    }

    return new Promise((resolve, reject) => {
      if(results.length > 0){
        const backendResponse: BackendResponse = {
          operation: 'database',
          
          data: {
            success: false,
            message: `${options.type}: ${options.data.name} already exists.`,
            payload: null,
            type: 'project',
            method: 'create'
          } 
        }

        reject(backendResponse)
        return
      }
      
      // If successfully updated Indexeddb store, then we update local copy of USerContentModal
      chrome.runtime
        .sendMessage(backendMessage)
        .then((response: BackendResponse) => {
          if (response.data.success) {
            // Everything is assigned their id as their respective key

            if (dataType === "captures") {
              UserContent._userContentModel["projects"][
                options.data.project_id
              ].captures[options.data.id] = options.data;
            } else {
              UserContent._userContentModel[dataType][options.data.id] =
                options.data;
            }

            // Return database response
            resolve(response);
          } else if (!response.data.success) {
            reject(response);
          }
        })
        .catch((error) => reject(error)); // Misc error
    });
  }

  private static _deleteData(
    options: CRUDDataOptions
  ): Promise<BackendResponse> {
    // Compose background script message
    const backendMessage = messageFactory("database", options);

    let dataType;
    switch (options.type) {
      case "capture":
        dataType = "captures";
        break;
      case "project":
        dataType = "projects";
        break;
      case "schema":
        dataType = "schemas";
        break;
    }

    return new Promise((resolve, reject) => {
      // If successfully updated Indexeddb store, then we update local copy of USerContentModal
      chrome.runtime
        .sendMessage(backendMessage)
        .then((response: BackendResponse) => {
          if (response.data.success) {
            // Respective data object deleted

            if (dataType === "captures") {
              delete UserContent._userContentModel["projects"][
                options.data.project_id
              ].captures[options.data.id];
            } else {
              delete UserContent._userContentModel[dataType][options.data];
            }
            
            // Return database response
            resolve(response);
          } else if (!response.data.success) {
            reject(response);
          }
        })
        .catch((error) => reject(error)); // Misc error
    });
  }

  private static _updateData(
    options: CRUDDataOptions
  ): Promise<BackendResponse> {
    // Validate create data options
    validateCRUDOptions(options);

    // Compose background script message
    const backendMessage = messageFactory("database", options);

    // Created time
    const currentTime = new Date();
    const d = currentTime.toISOString();

    let dataType;
    switch (options.type) {
      case "capture":
        dataType = "captures";
        options.data.last_edited = d;
        break;
      case "project":
        dataType = "projects";
        options.data.last_edited = d;
        break;
      case "schema":
        dataType = "schemas";
        break;
      default:
        dataType = options.type
    }

    return new Promise((resolve, reject) => {
      // If successfully updated Indexeddb store, then we update local copy of USerContentModal
      chrome.runtime
        .sendMessage(backendMessage)
        .then((response: BackendResponse) => {
          if (response.data.success) {
            // Everything is assigned their id as their respective key

            if (dataType === "captures") {
              UserContent._userContentModel["projects"][
                options.data.project_id
              ].captures[options.data.id] = options.data;
            } else if(dataType === 'details'){
              UserContent._userContentModel[dataType] = options.data
            } else {
              UserContent._userContentModel[dataType][options.data.id] =
                options.data;
            }

            // Return database response
            resolve(response);
          } else if (!response.data.success) {
            reject(response);
          }
        })
        .catch((error) => {

          reject(error)
        }); // Misc error
    });
  }

  // Getter and setter functions
  static get events() {
    return UserContent._eventEmitter;
  }

  static get hasLoaded() {
    return UserContent._hasLoaded
  }

  static set hasLoaded(f: boolean) {
    UserContent._hasLoaded = f
  }

  private static _setTestData() {
    UserContent._userContentModel = JSON.parse(
      JSON.stringify(UserContent._testData)
    ); // Create deep copy of test data
  }

  static get testData() {
    return UserContent._testData;
  }
}

export default UserContent;
