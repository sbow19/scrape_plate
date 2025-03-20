/**
 * When user first accesses application
 */
import { PopupTemplate } from "../components/popup_template";
import { AppButtonTemplate } from "../../../shared/src/components/buttons/appButton";
import { HomeButton } from "../../../shared/src/assets/icons/appIcons";
import { useNavigate } from "react-router";

import * as styles from './welcomeVIew.module.css'

export const WelcomeView = () => {
  return (
    <>
      <PopupTemplate
        contentComponent={<ContentComponent/>}
        secondaryActions={<SecondaryActions/>}
        primaryAction={<PrimaryAction />}
      />
    </>
  );
};

const ContentComponent = () => {
  return (
    <div
        className={styles.welcome_text_container}
    >
      <p
        className={styles.welcome_text_title_container}
      >
        <span
            className={styles.welcome_text_title}
        >Welcome to Scrape Plate!</span>
      </p>
      <p
        className={styles.text_block}
      >
        Create scraping schemas for sites that you visit frequently and
        scrape them as you go along.
      </p>
      <p
        className={styles.text_block}

      >
        Click Getting Started below to see some examples,
        or get started straight away by creating your first schema.
      </p>
    </div>
  );
};

const SecondaryActions = () => {
    return(
    <div
        className={styles.secondary_actions_container}
    >
        <AppButtonTemplate
            textStyle={{
                fontSize: 14
            }}
        >
            Getting Started
        </AppButtonTemplate>
        <AppButtonTemplate
            textStyle={{
                fontSize: 14
            }}
        >
            New Schema
        </AppButtonTemplate>
    </div>
    )
};

const PrimaryAction = () => {
    const navigate = useNavigate()
    return(<>
        <HomeButton 
            height={30}
            width={30}
            onClick={()=>{
              navigate('/')
            }}
        />
    </>)
};
