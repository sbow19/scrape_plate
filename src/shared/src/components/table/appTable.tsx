/**
 * Table template
 */

import { useCallback, useContext, useState } from "react";
import * as styles from "./appTable.module.css";
import { EditButton, DeleteButton } from "../../assets/icons/appIcons";
import { useNavigate } from "react-router";
import ToastContext from "../../../../action/src/context/Toast";
import { AppButtonTemplate } from "../buttons/appButton";


export const AppTableTemplate: React.FC<AppTableProps> = ({
  tableData,
  options,
}) => {

  const navigate = useNavigate()

  /**
   * TOAST OPERATIONS
   */
  const [toastState, setToastState] = useContext(ToastContext);
  const handleDeleteEntry = useCallback((dataType, row)=>{
    setToastState(prevState =>({
      ...prevState,
      open: true,
      text: <p> Are you sure you want to delete {row[1]}?</p>, // Usually name of entry
      buttons: [
        <AppButtonTemplate
          onClick={()=>{
            setToastState(prevState=>({
              open: false
            }))
          }}
        > No </AppButtonTemplate>,
        <AppButtonTemplate
        onClick={()=>{
          /* IMPLEMENT: trigger delete */
          setToastState(prevState=>({
            open: false
          }))

          console.log(row[0], dataType) // Id
        }}
        > Yes </AppButtonTemplate>,
      ]
    }))
  }, [toastState])

  return (
    <>
      {tableData?.data && (
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
                  >
                    {row.map((dataPoint, index) => {
                      // Skip first element as its reserved for ids
                      if(index === 0) return 
                      return (
                        <>
                          <td key={index} className={options?.enableInLineEdit ?? null ? 'inline' : ''}>
                           
                            {dataPoint}
                            

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
                              
                              navigate(`/${options.dataType}/${row[0]}`)
                            }}
                          />
                        )}
                        {options?.enableDelete && (
                          <DeleteButton height={25} width={25} onClick={()=>handleDeleteEntry(options.dataType, row)}/>
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
