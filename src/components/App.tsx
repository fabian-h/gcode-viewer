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

import { FocusStyleManager } from "@blueprintjs/core";

import "normalize.css/normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";

import * as React from "react";
import { FormGroup, Navbar, Alignment } from "@blueprintjs/core";

import styled from "styled-components";
import { Slider } from "@blueprintjs/core";
import { observer } from "mobx-react-lite";
import UIStore from "app/UIStore";

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

const ViewerContainer = styled.div`
  grid-column: 1/3;
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
            <Navbar.Heading>G-Code viewer for 3D printing</Navbar.Heading>
            <Navbar.Divider />

            <DrawSettingsButton
              drawSettings={UIStore.drawSettings}
              setDrawSetting={UIStore.setDrawSetting}
            />
          </Navbar.Group>
        </Navbar>
      </TopbarContainer>

      <ViewerContainer>
        {UIStore.trackProgress ? (
          <LiveGCodeViewer UIStore={UIStore} />
        ) : (
          <StaticGCodeViewer UIStore={UIStore} />
        )}
      </ViewerContainer>
      {UIStore.activeGCode ? (
        <ToolContainer>
          <FormGroup label="Current layer">
            <Slider
              value={UIStore.activeLayer}
              min={1}
              max={
                UIStore.numberOfLayers !== 0 ? UIStore.numberOfLayers - 2 : 100
              }
              disabled={UIStore.numberOfLayers === 0}
              labelStepSize={Math.ceil(1 + UIStore.numberOfLayers / 200) * 10}
              onChange={n => UIStore.setActiveLayer(n)}
            />
          </FormGroup>
        </ToolContainer>
      ) : null}
    </GridContainer>
    //</React.StrictMode>
  );
});
export default App;
