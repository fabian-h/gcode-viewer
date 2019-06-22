import * as React from "react";
import { UIStore, IGCode } from "app/UIStore";
import GCodeViewer from "./GCodeViewer";
import { toJS } from "mobx";
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
