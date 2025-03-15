/**
 * Class generates singleton object holding relevant user content
 * state. Other files can obtain content from this class from the useContent
 * hook
 */

import {
  messageFactory,
  validateCRUDOptions,
  validateData,
} from "../utils/helpers";
import { EventEmitter } from "./events";

class UserContent {
  // Contains the user content in one js object, which is indirectly
  // accessible from hooks. IMPLEMENT: Content Model Type
  private static _userContentModel: UserContentModel;
  private static _eventEmitter: EventEmitter = new EventEmitter();

  private static _testData: UserContentModel = {
    details: {
      hasUsedOnce: false,
      username: "",
      last_used: "",
    },
    projects: {
      "a11aa111-11aa-1111-a111-1a11a1a1a111": {
        name: "project1",
        date_created: "2025-01-10T14:30:00",
        last_edited: "2025-03-13T14:30:00",
        id: "a11aa111-11aa-1111-a111-1a11a1a1a111",
        captures: {
          "c11aa111-11aa-1111-a111-1a11a1a1a111": {
            id: "c11aa111-11aa-1111-a111-1a11a1a1a111",
            date_created: "2025-01-11T14:30:00",
            last_edited: "2025-01-12T14:30:00",
            project_id: "a11aa111-11aa-1111-a111-1a11a1a1a111",
            schema_id: "s11aa111-11aa-1111-a111-1a11a1a1a111",
            name: "capture1",
            capture_body: {
              id1: "hello",
              id2: "world",
            },
          },
          "c11aa111-11aa-1111-a111-1a11a1a1a112": {
            id: "c11aa111-11aa-1111-a111-1a11a1a1a112",
            date_created: "2025-01-11T14:30:00",
            last_edited: "2025-01-12T14:30:00",
            schema_id: "s11aa111-11aa-1111-a111-1a11a1a1a112",
            project_id: "a11aa111-11aa-1111-a111-1a11a1a1a111",
            name: "capture2",
            capture_body: {
              id3: "go",
              id4: "is great",
            },
          },
        },
      },
      "a11aa111-11aa-1111-a111-1a11a1a1a112": {
        name: "project2",
        date_created: "2024-01-10T14:30:00",
        last_edited: "2024-03-13T14:30:00",
        id: "a11aa111-11aa-1111-a111-1a11a1a1a112",
        captures: {
          "c11aa111-11aa-1111-a111-1a11a1a1a113": {
            id: "c11aa111-11aa-1111-a111-1a11a1a1a113",
            date_created: "2025-01-11T14:30:00",
            last_edited: "2025-01-12T14:30:00",
            project_id: "a11aa111-11aa-1111-a111-1a11a1a1a112",
            schema_id: "s11aa111-11aa-1111-a111-1a11a1a1a111",
            name: "capture1",
            capture_body: {
              id1: "hello",
              id2: "world",
            },
          },
          "c11aa111-11aa-1111-a111-1a11a1a1a114": {
            id: "c11aa111-11aa-1111-a111-1a11a1a1a114",
            date_created: "2025-01-11T14:30:00",
            last_edited: "2025-01-12T14:30:00",
            project_id: "a11aa111-11aa-1111-a111-1a11a1a1a112",
            schema_id: "s11aa111-11aa-1111-a111-1a11a1a1a112",
            name: "capture2",
            capture_body: {
              id3: "go",
              id4: "is great",
            },
          },
        },
      },
    },
    schemas: {
      "s11aa111-11aa-1111-a111-1a11a1a1a112": {
        id: "s11aa111-11aa-1111-a111-1a11a1a1a112",
        name: "schema2",
        url_match: "https://www.google.com",
        schema: {
          id3: {
            match: "id3",
            match_type: "id",
          },
          id4: {
            match: "id4",
            match_type: "id",
          },
        },
      },
      "s11aa111-11aa-1111-a111-1a11a1a1a111": {
        id: "s11aa111-11aa-1111-a111-1a11a1a1a111",
        name: "schema1",
        url_match: "https://www.amazon.com",
        schema: {
          id1: {
            match: "id1",
            match_type: "id",
          },
          id2: {
            match: "id2",
            match_type: "id",
          },
        },
      },
    },
  };

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
  private static async _fetchUserContent(): Promise<UserContentModel> {
    return new Promise((resolve, reject) => {
      // IMPLEMENT:  attempt to fetch content from IndexedDB
      try {
        resolve(UserContent._userContentModel);
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
   * @param {string} type // Subset of user content e.g. projects
   * @returns All of subset of user content - projects, schemas, and details. Captures cannot be returned this way
   *    */
  private static _returnAllOf(type: string): { [key: string]: any } {
    return UserContent._userContentModel[type];
  }

  /**
   *
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

  private static _createData(
    options: CRUDDataOptions
  ): Promise<DatabaseResponse> {
    // Validate create data options
    validateCRUDOptions(options);

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
      // If successfully updated Indexeddb store, then we update local copy of USerContentModal
      chrome.runtime
        .sendMessage(backendMessage)
        .then((response: DatabaseResponse) => {
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
  ): Promise<DatabaseResponse> {
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
        .then((response: DatabaseResponse) => {
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
  ): Promise<DatabaseResponse> {
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
    }

    return new Promise((resolve, reject) => {
      // If successfully updated Indexeddb store, then we update local copy of USerContentModal
      chrome.runtime
        .sendMessage(backendMessage)
        .then((response: DatabaseResponse) => {
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

  // Getter and setter functions
  static get events() {
    return UserContent._eventEmitter;
  }

  // private  static  _validateData(
  //   dataType: string,
  //   data: Schema | Capture | ProjectGroup
  // ) {
  //   switch (dataType) {
  //     case "project":
  //       {
  //         // Test key validity
  //         const projectGroupKeys = [
  //           "name",
  //           "last_edited",
  //           "date_created",
  //           "id",
  //           "captures",
  //         ];
  //         for (const key of Object.keys(data)) {
  //           if (!projectGroupKeys.includes(key))
  //             throw new TypeError(
  //               `ProjectGroup object does not contain ${key} key`
  //             );
  //         }

  //         // Test values
  //         for (const [key, value] of Object.entries(data)) {
  //           switch (key) {
  //             case "name":
  //               {
  //                 if (typeof value !== "string")
  //                   throw new TypeError("Project name not a string");

  //                 // TEST PROJECT NAME LENGTH
  //                 if (value.length > 20)
  //                   throw new Error(
  //                     "Project name must be less than 20 characters"
  //                   )
  //               }
  //               break;
  //             case "last_edited":
  //               if (typeof value !== "string")
  //                 throw new TypeError("Project last edited not a string");
  //               break;
  //             case "date_created":
  //               if (typeof value !== "string")
  //                 throw new TypeError("Project created data not a string");
  //               break;
  //             case "id":
  //               if (typeof value !== "string")
  //                 throw new TypeError("Project id not a string");
  //               break;
  //             case "captures":
  //               if (typeof value !== "object")
  //                 throw new TypeError("captures not an object");
  //               break;
  //           }
  //         }
  //       }
  //       break;
  //     case "capture":
  //       {
  //         // Test key validity
  //         const captureKeys = [
  //           "name",
  //           "last_edited",
  //           "date_created",
  //           "project_id",
  //           "id",
  //           "capture_body",
  //           "schema_id",
  //         ];
  //         for (const key of Object.keys(data)) {
  //           if (!captureKeys.includes(key))
  //             throw new TypeError(`Capture object does not contain ${key} key`);
  //         }

  //         // Test values
  //         for (const [key, value] of Object.entries(data)) {
  //           switch (key) {
  //             case "name":
  //               if (typeof value !== "string")
  //                 throw new TypeError("Capture  name not a string");

  //               if (value.length > 20)
  //                 throw new Error(
  //                   "Capture name must be less than 20 characters"
  //                 );

  //               break;
  //             case "last_edited":
  //               if (typeof value !== "string")
  //                 throw new TypeError("Capture  last edited not a string");
  //               break;
  //             case "date_created":
  //               if (typeof value !== "string")
  //                 throw new TypeError("Capture  created data not a string");
  //               break;
  //             case "id":
  //               if (typeof value !== "string")
  //                 throw new TypeError("Capture id not a string");
  //               break;
  //             case "capture_body":
  //               if (typeof value !== "object")
  //                 throw new TypeError("captures not an object");

  //               Object.values(value).forEach((captureBody: SchemaEntry) => {
  //                 if (captureBody.match?.length ?? 0 > 20)
  //                   throw new Error(
  //                     "Capture matched content must be less than 20 characters"
  //                   );
  //               });
  //               break;
  //             case "schema_id": {
  //               if (typeof value !== "string")
  //                 throw new TypeError("captures schema_id not an string");

  //               // Test Schema id exists in schemas list
  //               const schemaIdList = Object.keys(
  //                 UserContent._userContentModel["schemas"]
  //               );

  //               if (!schemaIdList.includes(value)) {
  //                 throw new Error("Capture schema id does not exist");
  //               }
  //               break;
  //             }
  //             case "project_id": {
  //               if (typeof value !== "string")
  //                 throw new TypeError("captures project_id not an string");

  //               // Test Schema id exists in schemas list
  //               const projectsList = Object.values(
  //                 UserContent._userContentModel["projects"]
  //               ).flat();

  //               const project = projectsList.find((project) => {
  //                 if (project.id === value) return true;
  //               });

  //               if (!project)
  //                 throw new Error("Capture project id does not exist");
  //               break;
  //             }
  //             default:
  //               break;
  //           }
  //         }
  //       }
  //       break;
  //     case "schema":
  //       {
  //         // Test key validity
  //         const schemaKeys = ["name", "id", "url_match", "schema"];
  //         for (const key of Object.keys(data)) {
  //           if (!schemaKeys.includes(key))
  //             throw new TypeError(`Schema object does not contain ${key} key`);
  //         }

  //         // Test values
  //         for (const [key, value] of Object.entries(data)) {
  //           switch (key) {
  //             case "name":
  //               if (typeof value !== "string" && value !== null)
  //                 throw new TypeError(
  //                   "Schema  name not a string or null value"
  //                 );
  //               if (value.length > 20)
  //                 throw new Error(
  //                   "Schema name must be less than 20 characters"
  //                 );

  //               break;
  //             case "id":
  //               if (typeof value !== "string")
  //                 throw new TypeError("Schema id not a string");
  //               break;
  //             case "schema":
  //               if (typeof value !== "object")
  //                 throw new TypeError("Schema not an object");

  //               // Schema entry selector must be less than 12 characters
  //               Object.keys(value).forEach((schemaKey) => {
  //                 if (schemaKey.length > 12)
  //                   throw new Error(
  //                     "Schema entry selector must be less than 13 characters"
  //                   );
  //               });
  //               break;
  //             case "url_match":
  //               if (typeof value !== "string")
  //                 throw new TypeError("Schema url match not a string");
  //               break;
  //           }
  //         }
  //       }
  //       break;
  //   }
  // }

  // ONLY FOR TESTING
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
