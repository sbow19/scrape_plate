import { useContext } from 'react';
import * as styles from './header.module.css'
import ModelReducerContext from '../../../context/ModelReducerContext';

export const CreateSchemaHeader: React.FC<SchemaFormProps> = ({
}) => {
  /**
   * Model reducer context
   */
  const [formModel, modelReducerObject,] = useContext(ModelReducerContext)
  return (
    <>
      <h3>Create Schema</h3>

      <div className={styles.content_line}>
        <label htmlFor="">
          <b>URL Match:</b>{" "}
        </label>
        <input
          type="text"
          value={formModel.url_match}
          onChange={(e) => {
            modelReducerObject.update("url_match", e.target.value);
          }}
          maxLength={100}
        />
      </div>

      <div className={styles.content_line}>
        <label htmlFor="">
          <b>Schema Name:</b>{" "}
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

      <div className={styles.table_header_container}>
        <h4>Schema</h4>
      </div>
    </>
  );
};