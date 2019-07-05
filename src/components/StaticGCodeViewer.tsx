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

import * as React from "react";
import { UIStore } from "app/UIStore";
import GCodeViewer from "./GCodeViewer";
import { observer } from "mobx-react-lite";
import { GCodeDropzone } from "./GCodeDropzone";
import { useState } from "react";
import styled from "styled-components";

interface IProps {
  UIStore: UIStore;
}
const StyledDiv = styled.div`
  flex: 1;
  display: flex;
`;

const StaticGCodeViewer = observer(
  ({
    UIStore: { activeGCode, activeLayer, transform, setTransform, drawSettings }
  }: IProps) => {
    const [isDragging, setDragging] = useState<boolean>(false);

    function handleDragOver(e: any) {
      setDragging(true);
    }

    function handleDragLeave(e: any) {
      setDragging(false);
    }

    if (activeGCode && !isDragging) {
      return (
        <StyledDiv onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
          <GCodeViewer
            from={activeGCode.layerPositions[activeLayer]}
            to={activeGCode.layerPositions[activeLayer + 1]}
            activeGCode={activeGCode}
            transform={transform}
            setTransform={setTransform}
            drawSettings={drawSettings}
          />
        </StyledDiv>
      );
    } else return <GCodeDropzone onFileLoad={() => setDragging(false)} />;
  }
);
export default StaticGCodeViewer;
