/**
 * Indexed db API
 */

import { deepClone } from "../../../shared/src/utils/helpers";

class IndexedDBOperations {
  private static _db: IDBDatabase | null = null;

  static openDB(): Promise<DBOperationResult> {
    return new Promise((resolve, reject) => {
      // Create new IndexedDB store - no version number provided
      const dbRequest = indexedDB.open("scrape_plate");

      dbRequest.onupgradeneeded = (ev) => {
        // Extract db from upgradeneeded event
        const db = dbRequest.result ?? null;

        if (!db) throw new Error("DB could not be updated");

        // Create object stores for user content model
        db.createObjectStore("details", {
          autoIncrement: true,
        });

        db.createObjectStore("projects", {
          keyPath: "id",
        });

        db.createObjectStore("schemas", {
          keyPath: "id",
        });

        // Only one array object lives here
        db.createObjectStore("schemaMatches", {
          autoIncrement: true,
        });

        resolve(
          IndexedDBOperations._DBOperationResultFactory(
            true,
            "create",
            "other",
            null
          )
        );
      };
      // IMPLEMENT: When db initialized, trigger the action to show in toolbar
      dbRequest.onsuccess = (ev) => {
        // Save db instance to global db
        IndexedDBOperations._db = dbRequest.result;

        // Add default object in details
        const tx = IndexedDBOperations._db.transaction(
          ["details"],
          "readwrite"
        );

        const detailsStore = tx.objectStore("details");

        const userContentDetails: UserContentDetails = {
          hasUsedOnce: false,
          last_used: "",
          username: "",
          currentProject: "",
          updateRequired: false,
        };
        const addRequest = detailsStore.add(userContentDetails);

        addRequest.onsuccess = () => {};
      };
      // IMPLEMENT: Some fatal error occurred when opening db
      dbRequest.onerror = (ev) => {
        /**
         * Handle error gracefully -- inform user that some issue occured
         */
        reject(
          IndexedDBOperations._DBOperationResultFactory(
            false,
            "create",
            "other",
            null
          )
        );
      };
    });
  }

  /**
   *
   * @param {CRUDDataOptions} dbQuery
   * @returns
   */
  static handleQuery(dbQuery: CRUDDataOptions): Promise<DBOperationResult> {
    return new Promise(async (resolve, reject) => {
      // Check if db open, else open for this session.
      // May be removed if service worker goes to sleep.
      if (!IndexedDBOperations._db) await IndexedDBOperations.openDB();

      const { method, type, data } = dbQuery;

      switch (method) {
        case "read":
          IndexedDBOperations._read(type)
            .then((dbResult) => {
              resolve(dbResult);
            })
            .catch((dbResult) => {
              reject(dbResult);
            });

          break;
        case "create":
          {
            const validDataTypes = ["schema", "project", "capture"];

            if (!validDataTypes.includes(type)) {
              reject(
                IndexedDBOperations._DBOperationResultFactory(
                  false,
                  "create",
                  type,
                  "Invalid data type"
                )
              );
            }

            IndexedDBOperations._create(type, data)
              .then((dbResult) => {
                resolve(dbResult);
              })
              .catch((dbResult) => {
                reject(dbResult);
              });
          }
          break;
        case "delete":
          {
            const validDataTypes = ["schema", "project", "capture", "schemaEntry"];
            if (!validDataTypes.includes(type)) {
              reject(
                IndexedDBOperations._DBOperationResultFactory(
                  false,
                  "delete",
                  type,
                  "Invalid data type"
                )
              );
            }

            IndexedDBOperations._delete(type, data)
              .then((dbResult) => {
                resolve(dbResult);
              })
              .catch((dbResult) => {
                reject(dbResult);
              });
          }
          break;
        case "update":
          {
            const validDataTypes = [
              "schema",
              "project",
              "capture",
              "details",
              "schemaMatches",
            ];
            if (!validDataTypes.includes(type)) {
              reject(
                IndexedDBOperations._DBOperationResultFactory(
                  false,
                  "update",
                  type,
                  "Invalid data type"
                )
              );
            }

            IndexedDBOperations._update(type, data)
              .then((dbResult) => {
                resolve(dbResult);
              })
              .catch((dbResult) => {
                reject(dbResult);
              });
          }
          break;
        default:
          reject(
            IndexedDBOperations._DBOperationResultFactory(
              false,
              "update",
              "other",
              "Invalid DB method"
            )
          );
          break;
      }
    });
  }
  /**
   * CRUD Operations
   */

  /**
   * Fetch data. Currently only supports whole
   * @param dataType
   */
  private static _read(
    dataType: DBOperationDataType
  ): Promise<DBOperationResult> {
    return new Promise((resolve, reject) => {
      switch (dataType) {
        case "all":
          let userContentModel: UserContentModel = {
            details: {},
            projects: {},
            schemas: {},
          };

          const tx = IndexedDBOperations._db?.transaction([
            "details",
            "projects",
            "schemas",
          ]);

          // Requests
          const detailsStore = tx?.objectStore("details") ?? null;
          const projectsStore = tx?.objectStore("projects") ?? null;
          const schemasStore = tx?.objectStore("schemas") ?? null;

          if (!detailsStore || !projectsStore || !schemasStore) {
            reject(
              IndexedDBOperations._DBOperationResultFactory(
                false,
                "read",
                "all",
                "Object stores could not be fetched"
              )
            );
            return;
          }
          // Get all
          const detailsStoreRequest = detailsStore.getAll();

          detailsStoreRequest.onsuccess = (ev) => {
            const details = ev.target as IDBRequest;
            const [retrievedData] = details.result;

            userContentModel.details = { ...retrievedData };
          };
          detailsStoreRequest.onerror = (ev) => {
            const details = ev.target as IDBRequest;

            reject(
              IndexedDBOperations._DBOperationResultFactory(
                false,
                "read",
                "all",
                details.error
              )
            );
            tx?.abort();
            return;
          };

          const projectsStoreRequest = projectsStore.getAll();
          projectsStoreRequest.onsuccess = (ev) => {
            const details = ev.target as IDBRequest;
            const retrievedData: Array<ProjectGroup> = details.result;
            for (let projectGroup of retrievedData) {
              userContentModel.projects[projectGroup.id] = projectGroup;
            }
          };
          projectsStoreRequest.onerror = (ev) => {
            const details = ev.target as IDBRequest;
            reject(
              IndexedDBOperations._DBOperationResultFactory(
                false,
                "read",
                "all",
                details.error
              )
            );
            tx?.abort();
            return;
          };

          const schemasStoreRequest = schemasStore.getAll();
          schemasStoreRequest.onsuccess = (ev) => {
            const details = ev.target as IDBRequest;
            const retrievedData: Array<Schema> = details.result;
            for (let schema of retrievedData) {
              userContentModel.schemas[schema.id] = schema;
            }
          };
          schemasStoreRequest.onerror = (ev) => {
            const details = ev.target as IDBRequest;
            reject(
              IndexedDBOperations._DBOperationResultFactory(
                false,
                "read",
                "all",
                details.error
              )
            );
            tx?.abort();
            return;
          };

          tx.oncomplete = () => {
            // Return user content model to send the frontend
            resolve(
              IndexedDBOperations._DBOperationResultFactory(
                true,
                "read",
                "all",
                null,
                userContentModel
              )
            );
          };

          break;
        case "schema":
          {
            let tx = IndexedDBOperations._db?.transaction(["schemas"]);

            let schemasStore = tx?.objectStore("schemas");

            let schemasRequest = schemasStore?.getAll();

            schemasRequest.onsuccess = (ev) => {
              const result = ev.target as IDBRequest;
              const schemasArray: Array<Schema> = result.result;
              const schemaStore = {};
              for (let schema of schemasArray) {
                schemaStore[schema.id] = schema;
              }
              resolve(
                IndexedDBOperations._DBOperationResultFactory(
                  true,
                  "read",
                  "schema",
                  null,
                  schemaStore
                )
              );
              tx?.commit();
              return;
            };

            schemasRequest.onerror((ev) => {
              const result = ev.target as IDBRequest;
              reject(
                IndexedDBOperations._DBOperationResultFactory(
                  false,
                  "read",
                  "schema",
                  result.error
                )
              );
              tx?.abort();
              return;
            });
          }
          break;
        case "schemaMatches":
          {
            const tx = IndexedDBOperations._db?.transaction(["schemaMatches"]);

            const schemasStore = tx?.objectStore("schemaMatches");

            const schemaRequest = schemasStore?.getAll();

            schemaRequest.onsuccess = (ev) => {
              const event = ev.target as IDBRequest;

              const schemaMatches = event.result[0];

              resolve(
                IndexedDBOperations._DBOperationResultFactory(
                  true,
                  "read",
                  "schemaMatches",
                  null,
                  schemaMatches
                )
              );
              tx?.commit();
              return;
            };

            schemaRequest.onerror = (ev) => {
              const event = ev.target as IDBRequest;

              reject(
                IndexedDBOperations._DBOperationResultFactory(
                  false,
                  "read",
                  "schemaMatches",
                  event.error
                )
              );
              tx?.abort();
              return;
            };
          }
          break;
        default:
          reject(
            IndexedDBOperations._DBOperationResultFactory(
              false,
              "read",
              dataType,
              "Invalid data type"
            )
          );
          break;
      }
    });
  }

  /**
   *
   * @param {} dataType
   * @param {} data
   * @returns {DBOperationResult}
   */
  private static _create(
    dataType: "schema" | "project" | "capture" | "details",
    data: ProjectGroup | Capture | Schema
  ): Promise<DBOperationResult> {
    return new Promise((resolve, reject) => {
      switch (dataType) {
        case "project":
          {
            const projectData = data as ProjectGroup;
            const tx = IndexedDBOperations._db?.transaction(
              ["projects"],
              "readwrite"
            );

            const addRequest = tx?.objectStore("projects").add(projectData);

            if (!addRequest) {
              reject(
                IndexedDBOperations._DBOperationResultFactory(
                  false,
                  "create",
                  "project",
                  "Create project request failed"
                )
              );
              tx?.abort();
              return;
            }

            addRequest.onsuccess = (ev) => {
              resolve(
                IndexedDBOperations._DBOperationResultFactory(
                  true,
                  "create",
                  "project",
                  null
                )
              );

              tx?.commit();
              return;
            };

            addRequest.onerror = (ev) => {
              const result = ev.target as IDBRequest;
              reject(
                IndexedDBOperations._DBOperationResultFactory(
                  false,
                  "create",
                  "project",
                  result.error
                )
              );
              tx?.abort();
              return;
            };
          }
          break;
        case "capture":
          {
            const captureData = data as Capture;
            const tx = IndexedDBOperations._db?.transaction(
              ["projects"],
              "readwrite"
            );

            // Get project
            const projectStore = tx?.objectStore("projects");
            if (!projectStore) {
              reject(
                IndexedDBOperations._DBOperationResultFactory(
                  false,
                  "create",
                  "capture",
                  "Get operation on projects store failed"
                )
              );
              tx?.abort();
              return;
            }

            const projectRequest = projectStore.get(captureData.project_id);
            if (!projectRequest) {
              reject(
                IndexedDBOperations._DBOperationResultFactory(
                  false,
                  "create",
                  "capture",
                  "Get operation on projects store failed"
                )
              );
              tx?.abort();
              return;
            }

            projectRequest.onsuccess = (ev) => {
              // Create capture in project
              const details = ev.target as IDBRequest;
              const project: ProjectGroup = details.result;

              // Create capture if key doesnt exist
              if (Object.keys(project.captures).includes(captureData.id)) {
                reject(
                  IndexedDBOperations._DBOperationResultFactory(
                    false,
                    "create",
                    "capture",
                    "Capture id already exists"
                  )
                );
                tx?.abort();
                return;
              } else {
                // Create new capture in captures property
                project.captures[captureData.id] = captureData;
              }

              // Put object back in store
              const putRequest = projectStore.put(project);

              putRequest.onerror = (ev) => {
                const details = ev.target as IDBRequest;
                reject(
                  IndexedDBOperations._DBOperationResultFactory(
                    false,
                    "create",
                    "capture",
                    details.error
                  )
                );
                tx?.abort();
                return;
              };
              putRequest.onsuccess = (ev) => {
                resolve(
                  IndexedDBOperations._DBOperationResultFactory(
                    true,
                    "create",
                    "capture",
                    null
                  )
                );
                tx?.commit();
                return;
              };
            };

            projectRequest.onerror = (ev) => {
              const details = ev.target as IDBRequest;
              reject(
                IndexedDBOperations._DBOperationResultFactory(
                  false,
                  "create",
                  "capture",
                  details.error
                )
              );
              tx?.abort();
              return;
            };
          }
          break;
        case "schema":
          {
            const schemaData = data as Schema;
            // Add
            const tx = IndexedDBOperations._db?.transaction(
              ["schemas"],
              "readwrite"
            );

            const addRequest = tx?.objectStore("schemas").add(schemaData);

            if (!addRequest) {
              reject(
                IndexedDBOperations._DBOperationResultFactory(
                  false,
                  "create",
                  "schema",
                  "Create schema request failed"
                )
              );
              tx?.abort();
              return;
            }

            addRequest.onsuccess = (ev) => {
              resolve(
                IndexedDBOperations._DBOperationResultFactory(
                  true,
                  "create",
                  "schema",
                  null
                )
              );

              tx?.commit();
              return;
            };

            addRequest.onerror = (ev) => {
              const result = ev.target as IDBRequest;
              reject(
                IndexedDBOperations._DBOperationResultFactory(
                  false,
                  "create",
                  "schema",
                  result.error
                )
              );
              tx?.abort();
              return;
            };
          }
          break;
        default:
          reject(
            IndexedDBOperations._DBOperationResultFactory(
              false,
              "create",
              dataType,
              "Invalid data type"
            )
          );
          break;
      }
    });
  }

  private static _update(
    dataType: "schema" | "project" | "capture" | "details" | "schemaMatches",
    data: ProjectGroup | Capture | Schema | UserContentDetails | Schema[]
  ): Promise<DBOperationResult> {
    return new Promise((resolve, reject) => {
      switch (dataType) {
        case "project":
          {
            const projectData = data as ProjectGroup;
            const tx = IndexedDBOperations._db?.transaction(
              ["projects"],
              "readwrite"
            );

            const projectsStore = tx?.objectStore("projects");
            if (!projectsStore) {
              reject(
                IndexedDBOperations._DBOperationResultFactory(
                  false,
                  "update",
                  "project",
                  "Object stores could not be fetched"
                )
              );
              return;
            }

            // Overwrite the project in the store. In
            const putRequest = projectsStore.put(projectData);

            putRequest.onsuccess = (ev) => {
              resolve(
                IndexedDBOperations._DBOperationResultFactory(
                  true,
                  "update",
                  "project",
                  null
                )
              );
              tx?.commit();
              return;
            };

            putRequest.onerror = (ev) => {
              const error = ev.target as IDBRequest;
              reject(
                IndexedDBOperations._DBOperationResultFactory(
                  false,
                  "update",
                  "project",
                  error.error
                )
              );
              tx?.abort();
              return;
            };
          }
          break;
        case "capture":
          {
            const captureData = data as Capture;
            const tx = IndexedDBOperations._db?.transaction(
              ["projects"],
              "readwrite"
            );

            // Get project
            const projectStore = tx?.objectStore("projects");
            if (!projectStore) {
              reject(
                IndexedDBOperations._DBOperationResultFactory(
                  false,
                  "update",
                  "capture",
                  "Get operation on projects store failed"
                )
              );
              tx?.abort();
              return;
            }

            const projectRequest = projectStore.get(captureData.project_id);
            if (!projectRequest) {
              reject(
                IndexedDBOperations._DBOperationResultFactory(
                  false,
                  "update",
                  "capture",
                  "Get operation on projects store failed"
                )
              );
              tx?.abort();
              return;
            }

            projectRequest.onsuccess = (ev) => {
              // Overwrite capture in project
              const details = ev.target as IDBRequest;
              const project: ProjectGroup = details.result;

              // Create capture if key doesnt exist
              if (!Object.keys(project.captures).includes(captureData.id)) {
                reject(
                  IndexedDBOperations._DBOperationResultFactory(
                    false,
                    "update",
                    "capture",
                    "Capture id does not exist"
                  )
                );
                tx?.abort();
                return;
              } else {
                // Replace new capture details in captures property
                project.captures[captureData.id] = captureData;
              }

              // Put object back in store
              const putRequest = projectStore.put(project);

              putRequest.onerror = (ev) => {
                const details = ev.target as IDBRequest;
                reject(
                  IndexedDBOperations._DBOperationResultFactory(
                    false,
                    "update",
                    "capture",
                    details.error
                  )
                );
                tx?.abort();
                return;
              };
              putRequest.onsuccess = (ev) => {
                resolve(
                  IndexedDBOperations._DBOperationResultFactory(
                    true,
                    "update",
                    "capture",
                    null
                  )
                );
                tx?.commit();
                return;
              };
            };

            projectRequest.onerror = (ev) => {
              const details = ev.target as IDBRequest;
              reject(
                IndexedDBOperations._DBOperationResultFactory(
                  false,
                  "update",
                  "capture",
                  details.error
                )
              );
              tx?.abort();
              return;
            };
          }
          break;
        case "schema":
          {
            const schemaData = data as Schema;
            const tx = IndexedDBOperations._db?.transaction(
              ["schemas"],
              "readwrite"
            );

            const schemasStore = tx?.objectStore("schemas");
            if (!schemasStore) {
              reject(
                IndexedDBOperations._DBOperationResultFactory(
                  false,
                  "update",
                  "schema",
                  "Object stores could not be fetched"
                )
              );
              return;
            }

            // Overwrite the schema in the store.
            const putRequest = schemasStore.put(schemaData);

            putRequest.onsuccess = (ev) => {
              resolve(
                IndexedDBOperations._DBOperationResultFactory(
                  true,
                  "update",
                  "schema",
                  null
                )
              );
              tx?.commit();
              return;
            };

            putRequest.onerror = (ev) => {
              const error = ev.target as IDBRequest;
              reject(
                IndexedDBOperations._DBOperationResultFactory(
                  false,
                  "update",
                  "schema",
                  error.error
                )
              );
              tx?.abort();
              return;
            };
          }
          break;
        case "details":
          {
            const userDetails = data as UserContentDetails;
            const tx = IndexedDBOperations._db?.transaction(
              ["details"],
              "readwrite"
            );

            const detailsStore = tx?.objectStore("details");
            if (!detailsStore) {
              reject(
                IndexedDBOperations._DBOperationResultFactory(
                  false,
                  "update",
                  "details",
                  "Object stores could not be fetched"
                )
              );
              return;
            }

            // Overwrite the details in the store.
            const putRequest = detailsStore.put(userDetails, 1);

            putRequest.onsuccess = (ev) => {
              resolve(
                IndexedDBOperations._DBOperationResultFactory(
                  true,
                  "update",
                  "details",
                  null
                )
              );
              tx?.commit();
              return;
            };

            putRequest.onerror = (ev) => {
              const error = ev.target as IDBRequest;
              reject(
                IndexedDBOperations._DBOperationResultFactory(
                  false,
                  "update",
                  "details",
                  error.error
                )
              );
              tx?.abort();
              return;
            };
          }
          break;
        case "schemaMatches":
          {
            const tx = IndexedDBOperations._db?.transaction(
              ["schemaMatches"],
              "readwrite"
            );

            const schemasStore = tx?.objectStore("schemaMatches");

            // 1 is the only key in this store
            const schemaRequest = schemasStore?.put(data, 1);

            schemaRequest.onsuccess = (ev) => {
              resolve(
                IndexedDBOperations._DBOperationResultFactory(
                  true,
                  "update",
                  "schemaMatches",
                  null
                )
              );
              tx?.commit();
              return;
            };

            schemaRequest.onerror = (ev) => {
              const event = ev.target as IDBRequest;
              reject(
                IndexedDBOperations._DBOperationResultFactory(
                  false,
                  "update",
                  "schemaMatches",
                  event.error
                )
              );
              tx?.abort();
              return;
            };
          }
          break;
        default:
          reject(
            IndexedDBOperations._DBOperationResultFactory(
              false,
              "update",
              dataType,
              "Invalid data type"
            )
          );
          break;
      }
    });
  }

  private static _delete(
    dataType: "schema" | "project" | "capture" | "schemaEntry",
    data:
      | SchemaId
      | ProjectId
      | {
          project_id: ProjectId;
          id: string;
        }
      | {
          schema_id: SchemaId;
          id: string;
        }
  ): Promise<DBOperationResult> {
    return new Promise((resolve, reject) => {
      switch (dataType) {
        case "project":
          {
            const projectID = data as ProjectId;
            const tx = IndexedDBOperations._db?.transaction(
              ["projects"],
              "readwrite"
            );
            const deleteRequest = tx?.objectStore("projects").delete(projectID);
            if (!deleteRequest) {
              reject(
                IndexedDBOperations._DBOperationResultFactory(
                  false,
                  "delete",
                  "project",
                  "Delete project request failed"
                )
              );
              tx?.abort();
              return;
            }
            deleteRequest.onsuccess = (ev) => {
              resolve(
                IndexedDBOperations._DBOperationResultFactory(
                  true,
                  "delete",
                  "project",
                  null
                )
              );
              tx?.commit();
              return;
            };
            deleteRequest.onerror = (ev) => {
              const details = ev.target as IDBRequest;
              reject(
                IndexedDBOperations._DBOperationResultFactory(
                  false,
                  "delete",
                  "project",
                  details.error
                )
              );
              tx?.abort();
              return;
            };
          }
          break;
        case "capture":
          {
            const captureDetails = data as {
              project_id: ProjectId;
              id: string;
            };
            const tx = IndexedDBOperations._db?.transaction(
              ["projects"],
              "readwrite"
            );

            // Get project
            const projectStore = tx?.objectStore("projects");
            if (!projectStore) {
              reject(
                IndexedDBOperations._DBOperationResultFactory(
                  false,
                  "delete",
                  "capture",
                  "Get operation on projects store failed"
                )
              );
              tx?.abort();
              return;
            }

            const projectRequest = projectStore.get(captureDetails.project_id);

            if (!projectRequest) {
              reject(
                IndexedDBOperations._DBOperationResultFactory(
                  false,
                  "delete",
                  "capture",
                  "Get operation on projects store failed"
                )
              );
              tx?.abort();
              return;
            }

            projectRequest.onsuccess = (ev) => {
              // Remove capture from project
              const details = ev.target as IDBRequest;
              const project: ProjectGroup = details.result;

              // Delete capture
              if (!Object.keys(project.captures).includes(captureDetails.id)) {
                reject(
                  IndexedDBOperations._DBOperationResultFactory(
                    false,
                    "delete",
                    "capture",
                    "Capture id does not exist"
                  )
                );
                tx?.abort();
                return;
              }

              delete project.captures[captureDetails.id];

              // Put object back in store
              const putRequest = projectStore.put(project);

              putRequest.onerror = (ev) => {
                const details = ev.target as IDBRequest;
                reject(
                  IndexedDBOperations._DBOperationResultFactory(
                    false,
                    "delete",
                    "capture",
                    details.error
                  )
                );
                tx?.abort();
                return;
              };

              putRequest.onsuccess = (ev) => {
                resolve(
                  IndexedDBOperations._DBOperationResultFactory(
                    true,
                    "delete",
                    "capture",
                    null
                  )
                );
                tx?.commit();
                return;
              };
            };

            projectRequest.onerror = (ev) => {
              const details = ev.target as IDBRequest;
              reject(
                IndexedDBOperations._DBOperationResultFactory(
                  false,
                  "delete",
                  "capture",
                  details.error
                )
              );
              tx?.abort();
              return;
            };
          }
          break;
        case "schema":
          {
            const schemaID = data as SchemaId;
            const tx = IndexedDBOperations._db?.transaction(
              ["schemas"],
              "readwrite"
            );
            const deleteRequest = tx?.objectStore("schemas").delete(schemaID);
            if (!deleteRequest) {
              reject(
                IndexedDBOperations._DBOperationResultFactory(
                  false,
                  "delete",
                  "schema",
                  "Delete schema request failed"
                )
              );
              tx?.abort();
              return;
            }
            deleteRequest.onsuccess = (ev) => {
              resolve(
                IndexedDBOperations._DBOperationResultFactory(
                  true,
                  "delete",
                  "schema",
                  null
                )
              );
              tx?.commit();
              return;
            };
            deleteRequest.onerror = (ev) => {
              const details = ev.target as IDBRequest;
              reject(
                IndexedDBOperations._DBOperationResultFactory(
                  false,
                  "delete",
                  "schema",
                  details.error
                )
              );
              tx?.abort();
              return;
            };
          }
          break;
        case "schemaEntry":
          {
            const schemaEntryDetails = data as {
              schema_id: SchemaId;
              id: string;
            };
            const tx = IndexedDBOperations._db?.transaction(
              ["schemas"],
              "readwrite"
            );

            console.log(schemaEntryDetails)
            // Get schema store
            const schemaStore = tx?.objectStore("schemas");
            if (!schemaStore) {
              reject(
                IndexedDBOperations._DBOperationResultFactory(
                  false,
                  "delete",
                  "schemaEntry",
                  "Get operation on schemas store failed"
                )
              );
              tx?.abort();
              return;
            }

            const schemaRequest = schemaStore.get(schemaEntryDetails.schema_id);

            if (!schemaRequest) {
              reject(
                IndexedDBOperations._DBOperationResultFactory(
                  false,
                  "delete",
                  "schemaEntry",
                  "Get operation on schemas store failed"
                )
              );
              tx?.abort();
              return;
            }

            schemaRequest.onsuccess = (ev) => {
              // Remove schemaEntry from schema
              const details = ev.target as IDBRequest;
              const schema: Schema = details.result;

              // Delete schemaEntry
              if (!Object.keys(schema.schema).includes(schemaEntryDetails.id)) {
                reject(
                  IndexedDBOperations._DBOperationResultFactory(
                    false,
                    "delete",
                    "schemaEntry",
                    "SchemaEntry id does not exist"
                  )
                );
                tx?.abort();
                return;
              }

              delete schema.schema[schemaEntryDetails.id];

              // Put object back in store
              const putRequest = schemaStore.put(schema);

              putRequest.onerror = (ev) => {
                const details = ev.target as IDBRequest;
                reject(
                  IndexedDBOperations._DBOperationResultFactory(
                    false,
                    "delete",
                    "schemaEntry",
                    details.error
                  )
                );
                tx?.abort();
                return;
              };

              putRequest.onsuccess = (ev) => {
                resolve(
                  IndexedDBOperations._DBOperationResultFactory(
                    true,
                    "delete",
                    "schemaEntry",
                    null
                  )
                );
                tx?.commit();
                return;
              };
            };

            schemaRequest.onerror = (ev) => {
              const details = ev.target as IDBRequest;
              reject(
                IndexedDBOperations._DBOperationResultFactory(
                  false,
                  "delete",
                  "schemaEntry",
                  details.error
                )
              );
              tx?.abort();
              return;
            };
          }
          break;
        default:
          reject(
            IndexedDBOperations._DBOperationResultFactory(
              false,
              "delete",
              dataType,
              "Invalid data type"
            )
          );
          break;
      }
    });
  }

  /**
   * Helpers
   */

  /**
   * @param {boolean} success             Was the requested operation successful
   * @param {DBOperations} method         What was the requested method on the db
   * @param {DBOperationDataType} type    What was the type of data was the subject of the requests (e.g.  captures)
   * @param {string | null} message       Was there a response message from the db operation, e.g. error message
   * @returns {DBOperationResult}
   */
  private static _DBOperationResultFactory(
    success: boolean,
    method: DBOperations,
    type: DBOperationDataType,
    message: DBErrorMessage | null = null,
    data?: any
  ): DBOperationResult {
    return {
      success,
      method,
      type,
      message,
      data: data ?? null,
    };
  }
}

export default IndexedDBOperations;
