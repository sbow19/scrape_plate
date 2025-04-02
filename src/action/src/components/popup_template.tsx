/**
 * Popup template.
 *
 * Home, Capture, Project, and Schema pages populate this template
 */
import * as styles from "./popup_template.module.css";
import {
  BackButton,
  ExitButton,
} from "../../../shared/src/assets/icons/appIcons";
import { useNavigate } from "react-router";

import ToastContext from "../context/Toast";
import { Toast } from "./Toast";
import { useState } from "react";

export const PopupTemplate: React.FC<PopupTemplateProps> = ({
  contentComponent,
  secondaryActions,
  primaryAction,
  backButtonEnabled,
}) => {
  const navigate = useNavigate();
  const handleToast = useState<ToastState>({
    open: false
  });
  return (
    <>
      <ToastContext.Provider value={handleToast}>
        <div className={styles.popup_outer_container}>
          <div className={styles.popup_header_container}>
            <div className={styles.popup_header_logo_container}>
              <img
                src="../../assets/web-scraper-128.png"
                alt="Scraper"
                className={styles.scrape_plate_logo}
              />

              <h1>Scrape Plate</h1>
            </div>

            <div className={styles.popup_header_options_container}>
              <ExitButton
                height={30}
                width={30}
                title='Exit'
                pathFill="transparent"
                strokeColor="black"
                svgFill="#353535ff"
                onClick={()=>{
                  window.close()
                }}
              />
            </div>
          </div>

          <div className={styles.popup_content_container}>
            {/* Back button  */}
            {backButtonEnabled ? (
              <div className={styles.back_button_container}>
                <BackButton
                  height={30}
                  width={30}
                  strokeColor="black"
                  onClick={() => {
                    navigate(-1);
                  }}
                  title='Back'
                />
              </div>
            ) : null}
            {contentComponent}
          </div>
          <div className={styles.popup_footer_container}>
            <div className={styles.secondary_action_container}>
              {/* Actions related to main content */}

              {secondaryActions}
            </div>

            <hr
              style={{
                width: "90%",
                height: 1,
                position: "relative",
                zIndex: 100,
                backgroundColor: "white",
                bottom: 5,
              }}
            />

            <div className={styles.primary_action_container} title="Scrape">
              {/* HOME OR SCRAPE BUTTON */}
              {primaryAction}
            </div>
          </div>
        </div>

        {/* Toast */}
        <Toast>
          
        </Toast>
        
      </ToastContext.Provider>
    </>
  );
};
