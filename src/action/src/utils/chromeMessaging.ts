export const openSidePanel = (
  tab: chrome.tabs.Tab,
  method: "create_schema" | "edit_schema" | "edit_capture",
  schema: Schema | Capture | null | Schema[]
): Promise<void> => {
  return new Promise((res) => {
    chrome.sidePanel.open(
      {
        tabId: tab?.id ?? 0,
      },
      () => {
        // Callback should run to sned data for screen
        const sidePanelMessage: BackendMessage = {
          operation: "openSidePanel",
          data: {
            method: method,
            schema: schema,
            tab: tab
          },
        };

        // Send message after delay to ensure the side panel receives message
        setTimeout(()=>{
          chrome.runtime.sendMessage(sidePanelMessage)
          window.close()
        }, 100)

        res()        
      }
    );
  });
};
