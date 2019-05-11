import { FocusStyleManager, Dialog } from "@blueprintjs/core";

import "normalize.css/normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";

import * as React from "react";
import {
  Button,
  FileInput,
  FormGroup,
  Navbar,
  Alignment
} from "@blueprintjs/core";

import styled from "styled-components";
import { Slider } from "@blueprintjs/core";
import { observer } from "mobx-react";
import UIStore from "app/UIStore";
//import DevTools from "mobx-react-devtools";

import GCodeUpload from "./GCodeUpload";
import OctoprintAddDialog from "./octoprint/OctoprintAddDialog";
import OctoprintSidebar from "./octoprint/OctoprintSidebar";
import LiveGCodeViewer from "./LiveGCodeViewer";
import StaticGCodeViewer from "./StaticGCodeViewer";
import DrawSettingsButton from "./DrawSettings";

// See https://blueprintjs.com/docs/#core/accessibility.focus-management
FocusStyleManager.onlyShowFocusOnTabs();

const GridContainer = styled.div`
  background: #eee;
  display: grid;
  grid-template-columns: 200px minmax(0, 1fr);
  grid-template-rows: auto minmax(0, 1fr) auto;
  width: 100vw;
  height: 100vh;
  align-self: stretch;
  overflow: hidden;
`;

const TopbarContainer = styled.div`
  grid-column: 1/3;
  grid-row: 1;
  gap: 0;
`;

const SidebarContainer = styled.div`
  grid-column: 1/2;
  grid-row: 2;
`;

const ViewerContainer = styled.div`
  grid-column: 2/3;
  grid-row: 2;
  background: white;
  display: flex;
`;

const ToolContainer = styled.div`
  grid-column: 1/3;
  grid-row: 3;
  padding: 0 20px 0 20px;
`;

interface IProps {}

const App = observer(IProps => {
  return (
    //<React.StrictMode>
    <GridContainer>
      <TopbarContainer>
        <Navbar className="bp3-dark">
          <Navbar.Group align={Alignment.LEFT}>
            <Navbar.Heading>GCode Viewer</Navbar.Heading>
            <Navbar.Divider />
            <Button
              className="bp3-minimal"
              icon="document"
              text="Add GCode file"
            />
            <OctoprintAddDialog />
            <DrawSettingsButton
              drawSettings={UIStore.drawSettings}
              setDrawSetting={UIStore.setDrawSetting}
            />
          </Navbar.Group>
        </Navbar>
      </TopbarContainer>
      <SidebarContainer>
        <OctoprintSidebar />
      </SidebarContainer>
      <ViewerContainer>
        {UIStore.trackProgress ? (
          <LiveGCodeViewer UIStore={UIStore} />
        ) : (
          <StaticGCodeViewer UIStore={UIStore} />
        )}
      </ViewerContainer>
      <ToolContainer>
        <FormGroup label="Active layer">
          <Slider
            value={UIStore.activeLayer}
            min={0}
            max={
              UIStore.numberOfLayers !== 0 ? UIStore.numberOfLayers - 2 : 100
            }
            disabled={UIStore.numberOfLayers === 0}
            labelStepSize={Math.ceil(1 + UIStore.numberOfLayers / 200) * 10}
            onChange={n => UIStore.setActiveLayer(n)}
          />
          <GCodeUpload />
        </FormGroup>
      </ToolContainer>
    </GridContainer>
    //</React.StrictMode>
  );
});
export default App;
