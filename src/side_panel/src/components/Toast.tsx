/**
 * Prompts user before some action continues
 */
import { useContext } from "react";
import ToastContext from "../context/Toast";
import { ToastTemplate } from "../../../shared/src/components/toast/ToastTemplate";

export const Toast = () => {
  const [toastState, setToastState] = useContext(ToastContext);
  return (
    <>
      {toastState.open && (
        <ToastTemplate
          toastState={toastState}
          setToastState={setToastState}
        ></ToastTemplate>
      )}
    </>
  );
};
