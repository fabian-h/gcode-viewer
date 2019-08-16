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
import { UIStore, IGCode, IDrawSettings } from "app/UIStore";
import GCodeViewer from "./GCodeViewer";
import { observer } from "mobx-react-lite";

interface IProps {
  UIStore: UIStore;
  drawSettings: IDrawSettings;
}

const LiveGCodeViewer = observer(
  ({
    UIStore: { activeGCode, transform, setTransform },
    drawSettings
  }: IProps) => {
    if (
      activeGCode &&
      activeGCode.connection &&
      activeGCode.connection.progress
    ) {
      const layer = getLayerFromBytePosition(
        activeGCode.connection.progress.filepos,
        activeGCode.layerBytePositions
      );

      return (
        <GCodeViewer
          currentLayer={layer}
          bytesToDraw={
            activeGCode.connection.progress.filepos -
            activeGCode.layerBytePositions[layer]
          }
          activeGCode={activeGCode}
          transform={transform}
          setTransform={setTransform}
          drawSettings={drawSettings}
        />
      );
    } else return <div>No GCode</div>;
  }
);
export default LiveGCodeViewer;

function getLayerFromBytePosition(
  bytePosition: number,
  layerPositions: number[]
) {
  let rv = 0;
  for (let i = 0; i < layerPositions.length; ++i) {
    if (bytePosition >= layerPositions[i]) rv = i;
  }
  return rv;
}
