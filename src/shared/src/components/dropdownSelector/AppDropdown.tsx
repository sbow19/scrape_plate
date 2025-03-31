import * as styles from "./AppDropdown.module.css";
import { AppButtonTemplate } from "../buttons/appButton";
import { useEffect, useState } from "react";

/**
 * REFctor -- Export button not APpDropdown
 * @param param0
 * @returns
 */
export const AppDropdown = ({ options, onChange, exportButton, set, data }) => {
  const [currentOption, setOption] = useState(set);
  useEffect(()=>{
    setOption(set)
  }, [set])
  return (
    <>
      <div className={styles.dropdown_container}>
        <select
          onChange={
            onChange
              ? (e) => {
                  onChange(e);
                  setOption(e.target.value);
                }
              : (e) => {
                  setOption(e.target.value);
                }
          }
          value={currentOption}
        >
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
              let blob;

              if (currentOption === "json") {
                // Create a Blob from the JSON data
                blob = new Blob([JSON.stringify(data, null, 2)], {
                  type: "application/json",
                });
              } else {
                return;
              }

              if (!blob) return;

              // Create a URL for the Blob
              const url = URL.createObjectURL(blob);

              // Create a link element to trigger the download
              const date = new Date();
              const link = document.createElement("a");
              link.href = url;
              link.download = `ScrapePlateExport_${date.toDateString()}.json`;

              // Trigger the download
              link.click();

              // Revoke the URL after download
              URL.revokeObjectURL(url);
            }}
          >
            Export
          </AppButtonTemplate>
        )}
      </div>
    </>
  );
};
