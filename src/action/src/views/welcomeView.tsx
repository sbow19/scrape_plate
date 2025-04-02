/**
 * When user first accesses application
 */
import { PopupTemplate } from "../components/popup_template";
import { AppButtonTemplate } from "../../../shared/src/components/buttons/appButton";

import * as styles from "./welcomeVIew.module.css";
import useContent from "../../../shared/src/hooks/useContent";
import { convertISOToDate } from "../../../shared/src/utils/helpers";
import { openSidePanel } from "../utils/chromeMessaging";
import { useContext } from "react";
import TabContext from "../context/Tab";

export const WelcomeView = () => {
  return (
    <>
      <PopupTemplate
        contentComponent={<ContentComponent />}
        secondaryActions={<SecondaryActions />}
        primaryAction={<PrimaryAction />}
        backButtonEnabled={false}
      />
    </>
  );
};

const ContentComponent = () => {
  return (
    <div className={styles.welcome_text_container}>
      <p className={styles.welcome_text_title_container}>
        <span className={styles.welcome_text_title}>
          Welcome to Scrape Plate!
        </span>
      </p>
      <p className={styles.text_block}>
        Create scraping schemas for sites that you visit frequently and scrape
        them as you go along.
      </p>
      <p className={styles.text_block}>
        Click Getting Started below to see some examples, or get started
        straight away by creating your first schema.
      </p>
    </div>
  );
};

const SecondaryActions = () => {
  const userEventModel = useContent();
  const tab = useContext(TabContext)

  const handleOnNewSchema = () => {

    const newDate = new Date().toISOString()
    const updateDetails: CRUDDataOptions = {
      method: "update",
      type: "details",
      data: {
        hasUsedOnce: true,
        username: "",
        last_used: convertISOToDate(newDate) ?? '',
        currentProject: '',
        updateRequired: false
      },
    };
    userEventModel
      ?.emit("update", updateDetails)
      .then((dbResponse: BackendResponse) => {

        if(dbResponse.data.success){
          openSidePanel(tab, "create_schema", {
            name: "",
            id: "",
            url_match: tab?.url ?? "",
            schema: {},
          })
        } else {
          throw dbResponse
        }
      })
      .catch((dbResponse: BackendResponse) => {
        // IMPLEMENT: handle fail to set user details
      });
  };

  return (
    <div className={styles.secondary_actions_container}>
      <AppButtonTemplate
        textStyle={{
          fontSize: 14,
        }}
      >
        Getting Started
      </AppButtonTemplate>
      <AppButtonTemplate
        textStyle={{
          fontSize: 14,
        }}
        onClick={handleOnNewSchema}
      >
        New Schema
      </AppButtonTemplate>
    </div>
  );
};

const PrimaryAction = () => {
  return (
    <>
      
    </>
  );
};
