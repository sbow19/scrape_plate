import { createContext } from "react";

const ToastContext = createContext<[ToastState, React.Dispatch<React.SetStateAction<ToastState>>]>([{}, ()=>{}])

export default ToastContext