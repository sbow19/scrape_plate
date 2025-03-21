import * as styles from "./Toast.module.css";

export const ToastTemplate = ({
    toastState,
    setToastState
}) => {

  if(toastState.timer){
    setTimeout(()=>{
      setToastState(prevState=>({
        open: false
      }))
    }, toastState.timer)
  }
  return (
    <div className={styles.toast_container} onClick={(e)=>{
        setToastState(prevState => ({
            ...prevState,
            open:false
        }))
    }}>
      <div className={styles.toast_inner_container}>
        <div
            className={styles.toast_view}
            onClick={(e)=>{
              /* PREVENT CLOSING TOAST */
              e.stopPropagation()
            }}
        >
          {/* Text section */}
          <div
            className={styles.toast_text_section}
          >
            {
              toastState.text ? toastState.text : null
            }

          </div>


          {/**
           *  BUTTONS SECTION
           */}
            <div
            className={styles.toast_button_section}
          >
            {
              toastState.buttons.map((button, index)=>{
                return button
              })
            }

          </div>
        </div>
      </div>
    </div>
  );
};
