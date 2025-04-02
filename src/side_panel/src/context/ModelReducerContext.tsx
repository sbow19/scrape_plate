import { createContext } from "react";

// Virtual schema model, reducer object to interact with virtual schema model, and focussed cell
const ModelReducerContext = createContext<[Schema | Capture, ReducerObject, string]>([{}, {}, ''])
export default ModelReducerContext