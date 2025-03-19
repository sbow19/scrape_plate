global.chrome = {
    runtime: {
      onMessage: {
        addListener: jest.fn()
      },
      sendMessage: jest.fn(),
      onInstalled: {
        addListener: jest.fn()
      }
    },
    // Add other mocks for APIs you use
};

global.indexedDBMocks = {
  mockDatabaseRequest: {
    onsuccess: jest.fn(),
    onerror: jest.fn(),
    onupgradeneeded: jest.fn(),
    _result: {
      createObjectStore: jest.fn(()=>null)  // Returns object store
    } ,// simulate if db object returned or not
    get result() {
      return this._result
    }
} 
}
global.indexedDB = {
  open: jest.fn(()=>indexedDBMocks.mockDatabaseRequest)
}
