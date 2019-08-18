/* 
Copyright 2019 Fabian Hiller

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. 
*/

import "normalize.css/normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";

import * as React from "react";

import { Alignment, Navbar } from "@blueprintjs/core";

import DrawSettingsButton from "./DrawSettings";
import { FocusStyleManager } from "@blueprintjs/core";
import GCodeProvider from "app/GCodeProvider";
import GCodeViewerUI from "./viewer/GCodeViewerUI";
//import LiveGCodeViewer from "./LiveGCodeViewer";
import OctoprintAddDialog from "./octoprint/OctoprintAddDialog";
import OctoprintFileBrowser from "./octoprint/OctoprintFileBrowser";
import OctoprintOverview from "./octoprint/OctoprintOverview";
import OctoprintStore from "../app/OctoprintStore";
//import StaticGCodeViewer from "./StaticGCodeViewer";
import Statistics from "./Statistics";
import UIStore from "app/UIStore";
import { observer } from "mobx-react-lite";
import styled from "styled-components/macro";
import { useDrawSettings } from "app/DrawSettings";

// See https://blueprintjs.com/docs/#core/accessibility.focus-management
FocusStyleManager.onlyShowFocusOnTabs();

const GridContainer = styled.div`
  background: #eee;
  display: grid;
  grid-template-columns: minmax(0px, 200px) minmax(0, 1fr);
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

const SidebarContainer = styled.div`
  grid-column: 1/2;
  grid-row: 2;
`;

interface IProps {}

const App = observer(() => {
  const [drawSettings, setDrawSetting] = useDrawSettings();
  return (
    //<React.StrictMode>
    <GCodeProvider>
      <GridContainer>
        <TopbarContainer>
          <Navbar className="bp3-dark">
            <Navbar.Group align={Alignment.LEFT}>
              <Navbar.Heading>G-Code viewer for 3D printing</Navbar.Heading>
              <Navbar.Divider />

              <DrawSettingsButton
                drawSettings={drawSettings}
                setDrawSetting={setDrawSetting}
              />
              <OctoprintAddDialog />
              {UIStore.activeGCode && (
                <Statistics statistics={UIStore.activeGCode.statistics} />
              )}
            </Navbar.Group>
          </Navbar>
        </TopbarContainer>
        <SidebarContainer>
          {OctoprintStore.servers.length > 0 &&
            OctoprintStore.servers[0].config && (
              <OctoprintFileBrowser config={OctoprintStore.servers[0].config} />
            )}
        </SidebarContainer>
        <ViewerContainer>
          {/*UIStore.activeGCode && UIStore.activeGCode.live ? (
          <LiveGCodeViewer UIStore={UIStore} drawSettings={drawSettings} />
        ) : (
          <StaticGCodeViewer UIStore={UIStore} drawSettings={drawSettings} />
        )*/}
          <GCodeViewerUI
            GCode={UIStore.activeGCode}
            drawSettings={drawSettings}
          />
          <OctoprintOverview />
        </ViewerContainer>
      </GridContainer>
    </GCodeProvider>
    //</React.StrictMode>
  );
});
export default App;
