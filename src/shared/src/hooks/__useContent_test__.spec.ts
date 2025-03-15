import { renderHook, act } from "@testing-library/react";
import useContent from "./useContent";
import UserContent from "../state/state";
import { setupMockChromeAPI } from "../__mocks__/chrome";
import { messageFactory } from "../utils/helpers";

describe("useContent hook", () => {
  it("Should return the Eventemitter on the user content model ", async () => {
    const { result } = renderHook(() => useContent());

    expect(typeof result.current.emit).toBe("function");
  });
  it("Should return user content model when emitting 'getAll' ", async () => {
    const { result } = renderHook(() => useContent());

    const userContentModel = await act(async () => {
      const userContentModel = await result.current.emit("getAll", null);

      return userContentModel;
    });

    const testData: UserContentModel = UserContent.testData;

    expect(userContentModel).toEqual(testData);
  });

  it("Should return users projects", async () => {
    const { result } = renderHook(() => useContent());

    const userProjects = await act(async () => {
      const userContentModel = await result.current.emit(
        "getAllOf",
        "projects"
      );

      return userContentModel;
    });

    const testData = UserContent.testData.projects;

    expect(userProjects).toEqual(testData);
  });

  it("Should return users details", async () => {
    const { result } = renderHook(() => useContent());
    const userDetails = await act(async () => {
      const userContentModel = await result.current.emit("getAllOf", "details");

      return userContentModel;
    });
    const testData = UserContent.testData.details;
    expect(userDetails).toEqual(testData);
  });

  it("Should return users schemas", async () => {
    const { result } = renderHook(() => useContent());
    const userSchemas = await act(async () => {
      const userContentModel = await result.current.emit("getAllOf", "schemas");
      return userContentModel;
    });
    const testData = UserContent.testData["schemas"];
    expect(userSchemas).toEqual(testData);
  });
});

describe("useContent hook - searches", () => {
  /**
   * General
   */

  it("Should return a TypeError if term is something other than a string", async () => {
    const { result } = renderHook(() => useContent());
    await act(async () => {
      const options = {
        type: "project",
        term: 12345,
      };
      await expect(result.current.emit("search", options)).rejects.toThrow(
        TypeError
      );
    });
  });

  it("Should return a Error if no argument for options provided", async () => {
    const { result } = renderHook(() => useContent());
    await act(async () => {
      await expect(result.current.emit("search", null)).rejects.toThrow(Error);
    });
  });

  /**
   * By project
   */
  it("Should return all matching projects", async () => {
    const { result } = renderHook(() => useContent());
    const userProjectMatches = await act(async () => {
      const options = {
        type: "project",
        term: "project1",
      };
      const userContentModel = await result.current.emit("search", options);
      return userContentModel;
    });

    const testData = [
      UserContent.testData["projects"]["a11aa111-11aa-1111-a111-1a11a1a1a111"],
    ];

    expect(userProjectMatches).toEqual(testData);
  });

  it("Should return an array of length 0 for failed match", async () => {
    const { result } = renderHook(() => useContent());
    const userProjectMatches = await act(async () => {
      const options = {
        type: "project",
        term: "not correct",
      };
      const userContentModel = await result.current.emit("search", options);
      return userContentModel;
    });

    expect(userProjectMatches.length).toBe(0);
    expect(userProjectMatches).toEqual([]);
  });

  it("Should return both projects if partial match", async () => {
    const { result } = renderHook(() => useContent());
    const userProjectMatches = await act(async () => {
      const options = {
        type: "project",
        term: "proje",
      };
      const userContentModel = await result.current.emit("search", options);
      return userContentModel;
    });

    expect(userProjectMatches.length).toEqual(2);
  });

  /**
   * By Schema
   */
  it("Should return all matching schemas", async () => {
    const { result } = renderHook(() => useContent());
    const userProjectMatches = await act(async () => {
      const options = {
        type: "schema",
        term: "schema2",
      };
      const userContentModel = await result.current.emit("search", options);
      return userContentModel;
    });

    const testData = [
      Object.values(UserContent.testData["schemas"]).find((schema) => {
        if (schema.name === "schema2") return true;
      }),
    ];

    expect(userProjectMatches).toEqual(testData);
  });

  it("Should return both schemas if partial match", async () => {
    const { result } = renderHook(() => useContent());
    const userProjectMatches = await act(async () => {
      const options = {
        type: "schema",
        term: "sche",
      };
      const userContentModel = await result.current.emit("search", options);
      return userContentModel;
    });

    expect(userProjectMatches.length).toEqual(2);
  });

  /**
   * By Capture
   */
  it("Should return all matching captures", async () => {
    const { result } = renderHook(() => useContent());
    const userProjectMatches = await act(async () => {
      const options = {
        type: "capture",
        term: "capture1",
      };
      const userContentModel = await result.current.emit("search", options);
      return userContentModel;
    });

    const testData = [];
    testData.push(
      UserContent.testData.projects["a11aa111-11aa-1111-a111-1a11a1a1a111"]
        .captures["c11aa111-11aa-1111-a111-1a11a1a1a111"]
    );
    testData.push(
      UserContent.testData.projects["a11aa111-11aa-1111-a111-1a11a1a1a112"]
        .captures["c11aa111-11aa-1111-a111-1a11a1a1a113"]
    );

    expect(userProjectMatches).toEqual(testData);
  });

  it("Should return all captures if partial match", async () => {
    const { result } = renderHook(() => useContent());
    const userCaptureMatches = await act(async () => {
      const options = {
        type: "capture",
        term: "cap",
      };
      const userContentModel = await result.current.emit("search", options);
      return userContentModel;
    });

    expect(userCaptureMatches.length).toEqual(4);
  });
});

describe("useContent hook - create records", () => {
  beforeAll(() => {
    setupMockChromeAPI();
  });

  /**
   * General
   */
  it("Should return a TypeError if options does not contain correct keys", async () => {
    const { result } = renderHook(() => useContent());
    await act(async () => {
      const options = {
        type: "project",
        term: 12345,
      };
      await expect(result.current.emit("create", options)).rejects.toThrow(
        TypeError
      );
    });
  });

  it("Should return a TypeError if used incorrect CRUD method", async () => {
    const { result } = renderHook(() => useContent());
    await act(async () => {
      const options = {
        type: "project",
        method: "null",
        data: {
          name: "12234,",
          id: "",
          date_created: "",
          last_edited: "",
          captures: {},
        },
      };
      await expect(result.current.emit("create", options)).rejects.toThrow(
        TypeError
      );
    });
  });

  it("Should return a Error if project name too long", async () => {
    const { result } = renderHook(() => useContent());
    await act(async () => {
      const options = {
        type: "project",
        method: "create",
        data: {
          name: "12234, huisrhfuirh worifwrfw ownfwr ",
          id: "",
          date_created: "",
          last_edited: "",
          captures: {},
        },
      };
      try {
        await result.current.emit("create", options);
        expect(true).toBe(false);
      } catch (e) {
        expect(e).toEqual(
          Error("Project name must be less than 20 characters")
        );
      }
    });
  });

  it("Should return a TypeError if project property values are of incorrect types", async () => {
    const { result } = renderHook(() => useContent());
    await act(async () => {
      const options: CRUDDataOptions = {
        type: "project",
        method: "create",
        data: {
          name: 12234,
          id: null,
          date_created: null,
          last_edited: 123,
          captures: {},
        },
      };
      await expect(result.current.emit("create", options)).rejects.toThrow(
        TypeError
      );
    });
  });

  it("Should return a TypeError if capture property values are of incorrect types", async () => {
    const { result } = renderHook(() => useContent());
    await act(async () => {
      const options: CRUDDataOptions = {
        type: "capture",
        method: "create",
        data: {
          name: 9012,
          id: "Hello world",
          date_created: null,
          schema_id: {},
          last_edited: null,
          capture_body: {},
        },
      };
      await expect(result.current.emit("create", options)).rejects.toThrow(
        TypeError
      );
    });
  });

  it("Should return a TypeError if schema property values are of incorrect types", async () => {
    const { result } = renderHook(() => useContent());
    await act(async () => {
      const options: CRUDDataOptions = {
        type: "schema",
        method: "create",
        data: {
          name: "",
          id: "Hello world",
          schema: "",
          url_match: 122323,
        },
      };
      await expect(result.current.emit("create", options)).rejects.toThrow(
        TypeError
      );
    });
  });

  it("Should  not create a copy of new item in local store on unsuccessful API call ", async () => {
    //Set up
    const testSchemaData: Schema = {
      name: "newSchema",
      id: crypto.randomUUID(),
      schema: {
        id1: {
          match: null,
          match_type: "id",
        },
        ".class.hello": {
          match: null,
          match_type: "css selector",
        },
        "^.tsx": {
          match: null,
          match_type: "regex",
        },
      },
      url_match: "https://",
    };

    const mockResponse: DatabaseResponse = {
      operation: "database",
      data: {
        type: "schema",
        method: "create",
        success: false,
        message: "FAILED TO WRITE TO DATABASE",
      },
    };
    chrome.runtime.sendMessage.mockResolvedValue(mockResponse);
    // Call hook - should update internal model when receives success response from sendMessage
    const { result } = renderHook(() => useContent());
    const responseMessage = await act(async () => {
      const options: CRUDDataOptions = {
        type: "schema",
        data: testSchemaData,
        method: "create",
      };

      let responseMessage;
      try {
        await result.current.emit("create", options);
      } catch (e) {
        responseMessage = e;
      }
      return responseMessage;
    });

    // Test - search for new content in schemas property of user content model
    const allSchemas = await UserContent.events.emit("getAllOf", "schemas");
    const newSchema = allSchemas[crypto.randomUUID()];

    expect(newSchema).toBe(undefined);
    expect(responseMessage).toEqual(mockResponse);
  });

  /**
   * By project
   */
  it("Should create a copy of new project in local store on successful API call ", async () => {
    //Set up

    const dummyDate = new Date();

    const testProjectData: ProjectGroup = {
      name: "newProjected",
      date_created: dummyDate.toISOString(),
      last_edited: dummyDate.toISOString(),
      id: crypto.randomUUID(),
      captures: {},
    };

    const mockResponse: DatabaseResponse = {
      operation: "database",
      data: {
        type: "project",
        method: "create",
        success: true,
      },
    };
    chrome.runtime.sendMessage.mockResolvedValue(mockResponse);
    // Call hook - should update internal model when receives success response from sendMessage
    const { result } = renderHook(() => useContent());
    const responseMessage = await act(async () => {
      const options: CRUDDataOptions = {
        type: "project",
        data: testProjectData,
        method: "create",
      };
      const responseMessage = await result.current.emit("create", options);
      return responseMessage;
    });

    // Test - search for new content in
    const allProjects = await UserContent.events.emit("getAllOf", "projects");
    const newProject = allProjects[crypto.randomUUID()];

    expect(newProject).not.toBe(undefined);
    expect(newProject).toEqual(testProjectData);
    expect(responseMessage).toEqual(mockResponse);
  });

  it("Should not create a copy of new project in local store when duplicated name found", async () => {
    const dummyDate = new Date();

    const testProjectData: ProjectGroup = {
      name: "project1",
      date_created: dummyDate.toISOString(),
      last_edited: dummyDate.toISOString(),
      id: crypto.randomUUID(),
      captures: {},
    };

    const mockResponse: DatabaseResponse = {
      operation: "database",
      data: {
        type: "project",
        method: "create",
        success: false,
        message: "DUPLICATE NAME",
      },
    };

    chrome.runtime.sendMessage.mockResolvedValue(mockResponse);
    // Call hook - should not update internal model when receives failure response from sendMessage
    const { result } = renderHook(() => useContent());
    await act(async () => {
      const options: CRUDDataOptions = {
        type: "project",
        data: testProjectData,
        method: "create",
      };

      try {
        await result.current.emit("create", options);
        expect(true).toBe(false);
      } catch (e) {
        expect(e).toEqual(mockResponse);
      }
    });
  });

  /**
   * By schema
   */
  it("Should create a copy of new schema in local store on successful API call ", async () => {
    //Set up
    const testSchemaData: Schema = {
      name: "newSchema",
      id: crypto.randomUUID(),
      schema: {
        id1: {
          match: null,
          match_type: "id",
        },
        ".class.hello": {
          match: null,
          match_type: "css selector",
        },
        "^.tsx": {
          match: null,
          match_type: "regex",
        },
      },
      url_match: "https://",
    };

    const mockResponse: DatabaseResponse = {
      operation: "database",
      data: {
        type: "schema",
        method: "create",
        success: true,
      },
    };
    chrome.runtime.sendMessage.mockResolvedValue(mockResponse);
    // Call hook - should update internal model when receives success response from sendMessage
    const { result } = renderHook(() => useContent());
    const responseMessage = await act(async () => {
      const options: CRUDDataOptions = {
        type: "schema",
        data: testSchemaData,
        method: "create",
      };
      const responseMessage = await result.current.emit("create", options);
      return responseMessage;
    });

    // Test - search for new content in schemas property of user content model
    const allSchemas = await UserContent.events.emit("getAllOf", "schemas");
    const newSchema = allSchemas[crypto.randomUUID()];

    expect(newSchema).not.toBe(undefined);
    expect(newSchema).toEqual(testSchemaData);
    expect(responseMessage).toEqual(mockResponse);
  });

  it("Should throw an error schema name too long", async () => {
    //Set up
    const testSchemaData: Schema = {
      name: "newSchema newschema newschema newschema",
      id: crypto.randomUUID(),
      schema: {},
      url_match: "https://",
    };

    // Call hook - should update internal model when receives success response from sendMessage
    const { result } = renderHook(() => useContent());
    await act(async () => {
      const options: CRUDDataOptions = {
        type: "schema",
        data: testSchemaData,
        method: "create",
      };

      try {
        await result.current.emit("create", options);
        expect(true).toBe(false);
      } catch (e) {
        expect(e).toEqual(Error("Schema name must be less than 20 characters"));
      }
    });
  });

  it("Should throw an error for invalid key length in schema", async () => {
    //Set up
    const testSchemaData: Schema = {
      name: "newSchema",
      id: crypto.randomUUID(),
      schema: {
        "id1uifwiuhwefw wfohwfeiuhwefwefw cwefwrerge": {
          match: null,
          match_type: "id",
        },
      },
      url_match: "https://",
    };

    // Call hook - should update internal model when receives success response from sendMessage
    const { result } = renderHook(() => useContent());
    await act(async () => {
      const options: CRUDDataOptions = {
        type: "schema",
        data: testSchemaData,
        method: "create",
      };

      try {
        await result.current.emit("create", options);
        expect(true).toBe(false);
      } catch (e) {
        expect(e).toEqual(
          Error("Schema entry selector must be less than 13 characters")
        );
      }
    });
  });

  it("Should not create a copy of new project in local store when duplicated name found", async () => {
    //Set up
    const testSchemaData: Schema = {
      name: "newSchema",
      id: crypto.randomUUID(),
      schema: {
        id1: {
          match: null,
          match_type: "id",
        },
        ".class.hello": {
          match: null,
          match_type: "css selector",
        },
        "^.tsx": {
          match: null,
          match_type: "regex",
        },
      },
      url_match: "https://",
    };

    const mockResponse: DatabaseResponse = {
      operation: "database",
      data: {
        type: "schema",
        method: "create",
        success: false,
        message: "DUPLICATE SCHEMA NAME",
      },
    };
    chrome.runtime.sendMessage.mockResolvedValue(mockResponse);
    // Call hook - should not update internal model when receives failure response from sendMessage
    const { result } = renderHook(() => useContent());
    await act(async () => {
      const options: CRUDDataOptions = {
        type: "schema",
        data: testSchemaData,
        method: "create",
      };

      try {
        await result.current.emit("create", options);
        expect(true).toBe(false);
      } catch (e) {
        expect(e).toEqual(mockResponse);
      }
    });
  });

  /**
   * By capture
   */
  it("Should create a copy of new capture in local store on successful API call ", async () => {
    //Set up
    const dummyDate = new Date();
    const testCaptureData: Capture = {
      name: "newCapture",
      id: crypto.randomUUID(),
      schema_id: "s11aa111-11aa-1111-a111-1a11a1a1a111",
      project_id: "a11aa111-11aa-1111-a111-1a11a1a1a112",
      capture_body: {},
      date_created: dummyDate.toISOString(),
      last_edited: dummyDate.toISOString(),
    };

    const mockResponse: DatabaseResponse = {
      operation: "database",
      data: {
        type: "capture",
        method: "create",
        success: true,
      },
    };
    chrome.runtime.sendMessage.mockResolvedValue(mockResponse);
    // Call hook - should update internal model when receives success response from sendMessage
    const { result } = renderHook(() => useContent());
    const responseMessage = await act(async () => {
      const options: CRUDDataOptions = {
        type: "capture",
        data: testCaptureData,
        method: "create",
      };

      const responseMessage = await result.current.emit("create", options);
      return responseMessage;
    });

    // Test - search for new content in schemas property of user content model
    const captures = await UserContent.events.emit("search", {
      term: "newCap",
      type: "capture",
    });

    expect(captures.length).toBe(1);
    expect(captures[0]).toEqual(testCaptureData);
    expect(responseMessage).toEqual(mockResponse);
  });

  it("Should return a Error if capture name too long", async () => {
    //Set up
    const testCaptureData: Capture = {
      name: "newCapture new capture new capture",
      id: "",
      schema_id: "s11aa111-11aa-1111-a111-1a11a1a1a111",
      project_id: "a11aa111-11aa-1111-a111-1a11a1a1a112",
      capture_body: {},
      date_created: "",
      last_edited: "",
    };

    const { result } = renderHook(() => useContent());
    await act(async () => {
      const options: CRUDDataOptions = {
        type: "capture",
        data: testCaptureData,
        method: "create",
      };
      try {
        await result.current.emit("create", options);
      } catch (e) {
        expect(e).toEqual(
          Error("Capture name must be less than 20 characters")
        );
      }
    });
  });

  it("Should throw an error if no matching schema id in local store", async () => {
    //Set up
    const testCaptureData: Capture = {
      name: "newCapture",
      id: "10000",
      schema_id: "s11aa111-11aa-11",
      project_id: "a11aa111-11aa-1111-a111-1a11a1a1a112",
      capture_body: {},
      date_created: "",
      last_edited: "",
    };

    const mockResponse: DatabaseResponse = {
      operation: "database",
      data: {
        type: "capture",
        method: "create",
        success: true,
      },
    };
    chrome.runtime.sendMessage.mockResolvedValue(mockResponse);
    // Call hook - should update internal model when receives success response from sendMessage
    const { result } = renderHook(() => useContent());
    const responseMessage = await act(async () => {
      const options: CRUDDataOptions = {
        type: "capture",
        data: testCaptureData,
        method: "create",
      };

      await expect(result.current.emit("create", options)).rejects.toThrow(
        Error
      );
    });
  });

  it("Should throw an error if no matching project id in local store", async () => {
    //Set up
    const testCaptureData: Capture = {
      name: "newCapture",
      id: "10000",
      schema_id: "s11aa111-11aa-1111-a111-1a11a1a1a111",
      project_id: "a1",
      capture_body: {},
      date_created: "",
      last_edited: "",
    };

    const mockResponse: DatabaseResponse = {
      operation: "database",
      data: {
        type: "capture",
        method: "create",
        success: true,
      },
    };
    chrome.runtime.sendMessage.mockResolvedValue(mockResponse);
    // Call hook - should update internal model when receives success response from sendMessage
    const { result } = renderHook(() => useContent());
    const responseMessage = await act(async () => {
      const options: CRUDDataOptions = {
        type: "capture",
        data: testCaptureData,
        method: "create",
      };

      await expect(result.current.emit("create", options)).rejects.toThrow(
        Error
      );
    });
  });

  it("Should throw an error if length of captured text greater than 20 characters", async () => {
    /**
     * The motivation is to avoid capturing potentially harmful content, like scripts.
     */

    //Set up
    const testCaptureData: Capture = {
      name: "newCapture",
      id: "10000",
      schema_id: "s11aa111-11aa-1111-a111-1a11a1a1a111",
      project_id: "a11aa111-11aa-1111-a111-1a11a1a1a112",
      capture_body: {
        ".class.hello": {
          match: "feurfheiuvbiruwbrivubrivubviuebrviebvieurvbeuirv",
          match_type: "css selector",
        },
      },
      date_created: "",
      last_edited: "",
    };

    // Call hook - should update internal model when receives success response from sendMessage
    const { result } = renderHook(() => useContent());
    await act(async () => {
      const options: CRUDDataOptions = {
        type: "capture",
        data: testCaptureData,
        method: "create",
      };

      try {
        await result.current.emit("create", options);
        expect(true).toBe(false);
      } catch (e) {
        expect(e).toEqual(
          Error("Capture matched content must be less than 20 characters")
        );
      }
    });
  });
});

describe("useContent hook - delete records", () => {
  it("Should remove project with correct id from local store", async () => {
    //Set up
    const project2 = "a11aa111-11aa-1111-a111-1a11a1a1a112";

    const mockResponse: DatabaseResponse = {
      operation: "database",
      data: {
        type: "project",
        method: "delete",
        success: true,
      },
    };
    chrome.runtime.sendMessage.mockResolvedValue(mockResponse);
    // Call hook - should update internal model when receives success response from sendMessage
    const { result } = renderHook(() => useContent());
    const responseMessage = await act(async () => {
      const options: CRUDDataOptions = {
        type: "project",
        data: project2,
        method: "delete",
      };
      const responseMessage = await result.current.emit("delete", options);
      return responseMessage;
    });

    // Test - project should not appear in user content projects
    const allProjects = await UserContent.events.emit("getAllOf", "projects");
    const deletedProject = allProjects["a11aa111-11aa-1111-a111-1a11a1a1a112"];

    expect(deletedProject).toBe(undefined);
    expect(responseMessage).toEqual(mockResponse);
  });

  it("Should remove schema with correct id from local store", async () => {
    //Set up
    const schema2 = "s11aa111-11aa-1111-a111-1a11a1a1a112";

    const mockResponse: DatabaseResponse = {
      operation: "database",
      data: {
        type: "schema",
        method: "delete",
        success: true,
      },
    };
    chrome.runtime.sendMessage.mockResolvedValue(mockResponse);
    // Call hook - should update internal model when receives success response from sendMessage
    const { result } = renderHook(() => useContent());
    const responseMessage = await act(async () => {
      const options: CRUDDataOptions = {
        type: "schema",
        data: schema2,
        method: "delete",
      };
      const responseMessage = await result.current.emit("delete", options);
      return responseMessage;
    });

    // Test - schema should not appear in user content projects
    const allSchemas = await UserContent.events.emit("getAllOf", "schemas");
    const deletedSchema = allSchemas["a11aa111-11aa-1111-a111-1a11a1a1a112"];

    expect(deletedSchema).toBe(undefined);
    expect(responseMessage).toEqual(mockResponse);
  });

  it("Should remove capture with correct id from local store", async () => {
    //Set up
    const captureData = {
      project_id: "a11aa111-11aa-1111-a111-1a11a1a1a111",
      id: "c11aa111-11aa-1111-a111-1a11a1a1a111"
    };

    const mockResponse: DatabaseResponse = {
      operation: "database",
      data: {
        type: "capture",
        method: "delete",
        success: true,
      },
    };
    chrome.runtime.sendMessage.mockResolvedValue(mockResponse);
    // Call hook - should update internal model when receives success response from sendMessage
    const { result } = renderHook(() => useContent());
    const responseMessage = await act(async () => {
      const options: CRUDDataOptions = {
        type: "capture",
        data: captureData,
        method: "delete",
      };
      const responseMessage = await result.current.emit("delete", options);
      return responseMessage;
    });

     // Test - search for deleted capture in user content model
     const captures = await UserContent.events.emit("search", {
      term: "c11aa111-11aa-1111-a111-1a11a1a1a111",
      type: "capture",
    });

    expect(captures.length).toBe(0);
    expect(responseMessage).toEqual(mockResponse);
  });
});

describe("useContent hook - update records", ()=>{
  it("Should change the project name name", async()=>{
    const dummyDate = new Date();

    const updatedTestProjectData: ProjectGroup = {
      name: "updatedProject",
      date_created: "2025-01-10T14:30:00",
      last_edited: dummyDate.toISOString(), // Indicates current time since edit
      id: "a11aa111-11aa-1111-a111-1a11a1a1a111",
      captures: {},
    };

    const mockResponse: DatabaseResponse = {
      operation: "database",
      data: {
        type: "project",
        method: "update",
        success: true,
      },
    };
    chrome.runtime.sendMessage.mockResolvedValue(mockResponse);
    // Call hook - should update internal model when receives success response from sendMessage
    const { result } = renderHook(() => useContent());
    const responseMessage = await act(async () => {
      const options: CRUDDataOptions = {
        type: "project",
        data: updatedTestProjectData,
        method: "update",
      };
      const responseMessage = await result.current.emit("update", options);
      return responseMessage;
    });

    // Test - search for updated project data
    const allProjects = await UserContent.events.emit("search", {
      term: "updatedProject",
      type: "project"
    });


    expect(allProjects.length).toBe(1);
    expect(allProjects[0].name).toEqual(updatedTestProjectData.name);
    expect(allProjects[0].last_edited).toEqual(dummyDate.toISOString());
    expect(allProjects[0].date_created).toEqual(updatedTestProjectData.date_created);


    expect(responseMessage).toEqual(mockResponse);
  })

  it("Should change schema details and body", async()=>{
    const dummyDate = new Date();

    const updatedTestProjectData: ProjectGroup = {
      name: "updatedProject",
      date_created: "2025-01-10T14:30:00",
      last_edited: dummyDate.toISOString(), // Indicates current time since edit
      id: "a11aa111-11aa-1111-a111-1a11a1a1a111",
      captures: {},
    };

    const mockResponse: DatabaseResponse = {
      operation: "database",
      data: {
        type: "project",
        method: "update",
        success: true,
      },
    };
    chrome.runtime.sendMessage.mockResolvedValue(mockResponse);
    // Call hook - should update internal model when receives success response from sendMessage
    const { result } = renderHook(() => useContent());
    const responseMessage = await act(async () => {
      const options: CRUDDataOptions = {
        type: "project",
        data: updatedTestProjectData,
        method: "update",
      };
      const responseMessage = await result.current.emit("update", options);
      return responseMessage;
    });

    // Test - search for updated project data
    const allProjects = await UserContent.events.emit("search", {
      term: "updatedProject",
      type: "project"
    });


    expect(allProjects.length).toBe(1);
    expect(allProjects[0].name).toEqual(updatedTestProjectData.name);
    expect(allProjects[0].last_edited).toEqual(dummyDate.toISOString());
    expect(allProjects[0].date_created).toEqual(updatedTestProjectData.date_created);


    expect(responseMessage).toEqual(mockResponse);
  })
})

describe("Backend message factory", () => {
  it("Should return an object with correct keys and values for database operation message", () => {
    const dummyCreateMessageData: CRUDDataOptions = {
      method: "create",
      type: "capture",
      data: {
        name: "12234",
        id: "209524345",
        last_edited: "2",
        date_created: "2434",
        capture_body: {},
        schema_id: "22334544",
      },
    };

    const dummyDeleteProjMessageData: CRUDDataOptions = {
      method: "delete",
      type: "project",
      data: "project 1",
    };


    const dummyDeleteCapMessageData: CRUDDataOptions = {
      method: "delete",
      type: "capture",
      data: {
        project_id: "project id",
        id: "capture id"
      },
    };

    // Test create operation
    const backendMessage = messageFactory("database", dummyCreateMessageData);

    // Check keys
    const backendMessageKeys = Object.keys(backendMessage);
    expect(backendMessageKeys).toEqual(["operation", "data"]);

    // Check values
    expect(backendMessage.operation).toBe("database");
    expect(backendMessage.data).toEqual(dummyCreateMessageData);

    // Test delete operation
    const backendDeleteProjMessage = messageFactory("database", dummyDeleteProjMessageData);

    // Check values
    expect(backendDeleteProjMessage.operation).toBe("database");
    expect(backendDeleteProjMessage.data).toEqual(dummyDeleteProjMessageData);

    const backendDeleteCapMessage = messageFactory("database", dummyDeleteCapMessageData);

    // Check values
    expect(backendDeleteCapMessage.operation).toBe("database");
    expect(backendDeleteCapMessage.data).toEqual(dummyDeleteCapMessageData);
  });

  it("Should throw a TypeError if an incorrect operation is provided", () => {
    const dummyMessageData: CRUDDataOptions = {
      method: "create",
      type: "capture",
      data: {
        name: "12234",
        id: "209524345",
        last_edited: "2",
        date_created: "2434",
        capture_body: {},
        schema_id: "22334544",
      },
    };
    expect(() =>
      messageFactory("blueberry", dummyMessageData)
    ).toThrow(TypeError);
  });
});
