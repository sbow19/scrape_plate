import * as styles from "./Toast.module.css";

export const ToastTemplate: React.FC<ToastProps> = ({
    toastState,
    setToastState,
}) => {

  /* AUTOMATICALLY CLOSE */
  if(toastState.timer){
    setTimeout(()=>{
      setToastState({
        open: false
      })

      if(toastState.timerCallback){
        toastState.timerCallback()
      }
    }, toastState.timer)
  }
  return (
    <div className={styles.toast_container} onClick={()=>{
        setToastState({
            open:false
        })
    }}>
      <div className={styles.toast_inner_container}>
        <div
            className={styles.toast_view}
            onClick={(e)=>{
              /* PREVENT CLOSING TOAST when clicking toast*/
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
              toastState.buttons && toastState.buttons.map((button, index)=>{
                return button
              })
            }

          </div>
        </div>
      </div>
    </div>
  );
};
