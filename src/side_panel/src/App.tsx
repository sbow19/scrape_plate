/**
 * Listen to events to open side panel
 */
import { SidePanelTemplate } from "./components/side_panel_template";
import { SchemaFormTemplate } from "./components/schema_form_template";

export const App = () => {
  return (
    <div
        style={{
            height: '95vh',
            minHeight: 650,
            // width: '100%',
            width: 340,
            position: 'relative',
            pointerEvents: 'none'
        }}
    >
      <SidePanelTemplate>
        <SchemaFormTemplate
          modelType="capture"
          operation="edit_capture"
        />
      </SidePanelTemplate>
    </div>
  );
};
