/**
 * Table template
 */

import { useState } from "react";
import * as styles from "./appTable.module.css";
import { EditButton, DeleteButton } from "../../assets/icons/appIcons";
import { useNavigate } from "react-router";


export const AppTableTemplate: React.FC<AppTableProps> = ({
  tableData,
  options,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleMouseOver = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseOut = () => {
    setHoveredIndex(null);
  };

  const navigate = useNavigate()

  return (
    <>
      {tableData && (
        <table className={styles.table_outer}>
          <thead>
            {tableData.header.map((header, index) => {
              return (
                <>
                  <th key={index}>{header}</th>
                </>
              );
            })}
            {/**
             * Options button optional if at least one is enabled
             */}
            {options ? <th key={"options_header"}>options</th> : null}
          </thead>
          <tbody className={styles.table_body}>
            {tableData.data.map((row, index) => {
              return (
                <>
                  <tr
                    key={index}
                    onMouseOver={() => handleMouseOver(index)} // Set hovered index
                    onMouseOut={handleMouseOut} // Reset hovered index
                    className={hoveredIndex === index ? "animated-row" : ""}
                  >
                    {row.map((dataPoint, index) => {
                      return (
                        <>
                          <td key={index} className={options?.enableInLineEdit ?? null ? 'inline' : ''}>
                            {options?.enableInLineEdit ? (
                              <>
                                {/* REFACTOR OUT */}
                                <input type="text" value={dataPoint} className={styles.input_style} readOnly />
                                <EditButton 
                                  height={20}
                                  width={20}
                                />
                              </>
                            ) : (
                              dataPoint
                            )}

                          </td>
                        </>
                      );
                    })}
                    {/**
                     * Options button optional if at least one is enabled
                     */}
                    {options ? (
                      <td className={styles.options_container}>
                        {options?.enableEdit && (
                          <EditButton 
                            height={25} 
                            width={25} 
                            onClick={()=>{
                              navigate(`/projects/${1}`)
                            }}
                          />
                        )}
                        {options?.enableDelete && (
                          <DeleteButton height={25} width={25} />
                        )}
                      </td>
                    ) : null}
                  </tr>
                </>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
};
