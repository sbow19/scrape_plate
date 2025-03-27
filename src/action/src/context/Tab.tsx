import { createContext } from "react";

const TabContext = createContext<chrome.tabs.Tab>(null)

export default TabContext