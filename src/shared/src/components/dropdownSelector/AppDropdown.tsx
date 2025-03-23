import * as styles from "./AppDropdown.module.css";
import { AppButtonTemplate } from "../buttons/appButton";

export const AppDropdown = ({ options, onChange, exportButton, set }) => {

  return (
    <>
      <div className={styles.dropdown_container}>
        <select onChange={onChange} value={set}>
          {options.map((option, index) => {
            return (
              <option value={option} key={index}>
                {option}
              </option>
            );
          })}
        </select>
        {exportButton && (
          <AppButtonTemplate
            onClick={() => {
              // IMPLEMENT: handler function to export data in specific format
            }}
          >
            Export
          </AppButtonTemplate>
        )}
      </div>
    </>
  );
};
