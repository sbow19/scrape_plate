import * as AppIcons from "../../../shared/src/assets/icons/appIcons";
import { PopupTemplate } from "../components/popup_template";
import { AppButtonTemplate } from "../../../shared/src/components/buttons/appButton";
import { WelcomeView } from "../views/welcomeView";
import { HomeView } from "../views/homeView";
import { ButtonSlider } from "../../../shared/src/components/slider/appSlider";
import { ProjectView } from "../views/projectView";
import { CaptureView } from "../views/captureView";
import { SchemaView } from "../views/schemaView";
import { SchemaListView } from "../views/schemaListView";
import { ProjectListView } from "../views/projectListView";
import { CreateProject} from "../views/createProjectView";

export const TestingArea = () => {
  return (
    <>
        {/* <Icons /> */}
        {/* <PopupTemplate /> */}
        {/* <AppButtonTemplate> Hello </AppButtonTemplate> */}
        {/* <WelcomeView></WelcomeView> */}
        {/* <HomeView></HomeView> */}
        {/* <ButtonSlider></ButtonSlider> */}
        {/* <ProjectView></ProjectView> */}
        {/* <CaptureView></CaptureView> */}
        {/* <SchemaView></SchemaView> */}
        {/* <SchemaListView></SchemaListView> */}
        {/* <ProjectListView></ProjectListView> */}
        <CreateProject></CreateProject>
    </>
  );
};

const Icons = () => {
  return (
    <>
      <AppIcons.BackButton
        height={40}
        width={40}
        strokeColor="black"
        pathFill="none"
        svgFill="none"
      />
      <AppIcons.DeleteButton
        height={40}
        width={40}
        strokeColor="black"
        pathFill="none"
        svgFill="none"
      />

      <AppIcons.EditButton
        height={40}
        width={40}
        strokeColor="black"
        pathFill="none"
        svgFill="none"
      />

      <AppIcons.ExitButton
        height={40}
        width={40}
        strokeColor="black"
        pathFill="none"
        svgFill="none"
      />

      <AppIcons.HomeButton
        height={40}
        width={40}
        strokeColor="black"
        pathFill="none"
        svgFill="none"
      />

      <AppIcons.ScrapeButton
        height={40}
        width={40}
        strokeColor="black"
        pathFill="blue"
        svgFill="none"
      />

      <AppIcons.SeeButton
        height={40}
        width={40}
        strokeColor="black"
        pathFill="blue"
        svgFill="none"
      />
    </>
  );
};

const Text = ()=>{
  return <>Hellooooooo</>
}


