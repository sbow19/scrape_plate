import { createContext } from "react";

// Current Schema and matching schema list
const SchemaMatchesContext = createContext<[Schema[], React.Dispatch<React.SetStateAction<Schema | Capture | null>>]>([[], ()=>{}])
export default SchemaMatchesContext