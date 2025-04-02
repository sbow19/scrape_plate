/**
 * SIDE PANEL TEMPLATE
 * MANAGE SCHEMA CREATION, EDITOR, AND CAPTURE VIEW
 */
import * as styles from "./side_panel_template.module.css";
import {
  ExitButton,
} from "../../../shared/src/assets/icons/appIcons";

import ToastContext from "../context/Toast";
import { Toast } from "./Toast";
import { useState } from "react";

export const SidePanelTemplate: React.FC = ({ children }) => {
  const handleToast = useState<ToastState>({
    open: false,
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
                height={40}
                width={40}
                title="Exit"
                pathFill="transparent"
                strokeColor="black"
                svgFill="#353535ff"
                onClick={() => {
                  console.log("Hello")
                  window.close();
                }}
              />
            </div>
          </div>

          <div className={styles.popup_content_container}>{children}</div>
        </div>

        {/* Toast */}
        <Toast></Toast>
      </ToastContext.Provider>
    </>
  );
};
