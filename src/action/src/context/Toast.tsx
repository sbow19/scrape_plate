import { createContext } from "react";

const ToastContext = createContext<[ToastState, (toast: ToastState)=>void]>([{}, ()=>{}])

export default ToastContext