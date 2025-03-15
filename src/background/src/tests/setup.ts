global.chrome = {
    runtime: {
      onMessage: {
        addListener: jest.fn()
      },
      sendMessage: jest.fn(),
    },
    // Add other mocks for APIs you use
  };