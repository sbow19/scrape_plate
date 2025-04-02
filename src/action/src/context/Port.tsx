import { createContext } from "react";

const PortContext = createContext<chrome.runtime.Port>(null)

export default PortContext