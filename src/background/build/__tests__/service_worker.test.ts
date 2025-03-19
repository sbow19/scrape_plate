// service-worker.test.js
import "../service-worker";
import IndexedDBOperations from "../../src/db/db";
import { backendResponseFactory } from "../../src/utils/utils";

describe("On Installed Scripts", () => {
  test("Should call IndexedDB to set up new store", () => {
    // Trigger on installed event listener
    chrome.runtime.onInstalled.addListener.mock.calls[0][0]();

    // Get mocked onupgradeneeded function
    const mockDatabaseRequest = indexedDBMocks.mockDatabaseRequest;
    const dbMock = mockDatabaseRequest._result;

    const spy = jest.spyOn(mockDatabaseRequest, "onupgradeneeded");
    const getterSpy = jest.spyOn(mockDatabaseRequest, "result", "get");
    const createStoreMock = jest.spyOn(dbMock, "createObjectStore");

    // Trigger onupgraded event - use mock IDBChangeEvent
    mockDatabaseRequest.onupgradeneeded(null);

    // Ensure no response is sent for an unknown action
    expect(indexedDB.open).toHaveBeenCalledTimes(1);
    expect(indexedDB.open).toHaveBeenCalledWith("scrape_plate");

    // Check on upgrade needed callback fired properly
    expect(spy).toHaveBeenCalledWith(null);
    expect(getterSpy).toHaveBeenCalled();

    // Check create object store as called three times
    expect(createStoreMock).toHaveBeenCalledTimes(3);
    expect(createStoreMock).toHaveBeenNthCalledWith(1, "details");
    expect(createStoreMock).toHaveBeenNthCalledWith(2, "projects", {
      keyPath: "id",
    });
    expect(createStoreMock).toHaveBeenNthCalledWith(3, "schemas", {
      keyPath: "id",
    });
  });

  // test("Should return userContentModel on get all  CRUD operation request", () => {

  //   // Mock data
  //   const message: BackendMessage = {
  //     operation: "database",
  //     data: {
  //       type: "all",
  //       method: "read",
  //     },
  //   };
  //   const sender = null;
  //   const sendResponse = jest.fn();

  //   // Spy on methods
  //   const handleQuerySpy = jest.spyOn(IndexedDBOperations, "handleQuery");

  //   // Trigger on installed event listener
  //   chrome.runtime.onMessage.addListener.mock.calls[0][0](
  //     message,
  //     sender,
  //     sendResponse
  //   );

  //   // Assertions
  //   expect(handleQuerySpy).toHaveBeenCalledWith(message.data);
  //   expect(handleQuerySpy).toHaveReturnedWith(Promise<DBOperationResult>);
  // });
});
