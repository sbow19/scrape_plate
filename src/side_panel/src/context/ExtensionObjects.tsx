import { createContext } from "react";

const ExtensionContext = createContext<[chrome.tabs.Tab | null, chrome.runtime.Port| null] >([null, null])

export default ExtensionContext