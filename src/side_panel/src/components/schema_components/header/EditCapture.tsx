import * as styles from  './header.module.css'

export const EditCaptureHeader: React.FC<SchemaFormProps> = ({
    formModel,
    modelReducerObject,
  }) => {
    /* FETCH PROJECT NAME AND CAPTURE NAME FROM USER CONTENT MODEL */

    
    return (
      <>
        <h3>Edit Capture</h3>
  
        <div className={styles.content_line}>
          <label htmlFor="">
            <b>URL Match: {formModel.url_match}</b>{" "}
          </label>
        </div>
  
        <div className={styles.content_line}>
          <label htmlFor="">
            <b>Name:</b>{" "}
          </label>
          <input
            type="text"
            value={formModel?.name ?? ''}
            onChange={(e) => {
              modelReducerObject.update("name", e.target.value);
            }}
            maxLength={20}
          />
        </div>
  
        <div className={styles.content_line}>
          <p>
            <b>Schema: {formModel?.schema_id ?? ''}</b>{" "}
          </p>
        </div>
  
        <div className={styles.content_line}>
          <p>
            <b>Project: {formModel?.project_id ?? ''} </b>{" "}
          </p>
        </div>
  
        <div className={styles.table_header_container}>
          <h4>Capture</h4>
        </div>
      </>
    );
  };