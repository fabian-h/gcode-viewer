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
import { UIStore, IGCode } from "app/UIStore";
import GCodeViewer from "./GCodeViewer";
import { observer } from "mobx-react-lite";

interface IProps {
  UIStore: UIStore;
}

const LiveGCodeViewer = observer(
  ({
    UIStore: { activeGCode, transform, setTransform, drawSettings }
  }: IProps) => {
    if (
      activeGCode &&
      activeGCode.connection &&
      activeGCode.connection.progress
    ) {
      const currentLine = getLineByBytePos(
        activeGCode.connection.progress.filepos,
        activeGCode
      );
      const from = findLayerByLine(activeGCode.layerPositions, currentLine);
      const to = currentLine;
      /*console.log(
      "LIVE",
      activeGCode.connection.progress.filepos,
      currentLine,
      from,
      to
    );*/
      return (
        <GCodeViewer
          from={from}
          to={to}
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

function findLayerByLine(layerPositions: number[], currentLine: number) {
  for (let i = 0; i < layerPositions.length; ++i) {
    if (layerPositions[i] > currentLine) {
      return layerPositions[i - 1];
    }
  }
  return layerPositions.length;
}

function getLineByBytePos(bytepos: number, activeGCode: IGCode) {
  for (let i = 0; i < activeGCode.lineIndex.length; ++i) {
    if (activeGCode.lineIndex[i] > bytepos) {
      return i;
    }
  }
  return activeGCode.lineIndex.length;
}
