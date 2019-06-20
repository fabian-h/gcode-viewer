import * as React from "react";
import { UIStore } from "app/UIStore";
import GCodeViewer from "./GCodeViewer";
import { observer } from "mobx-react";
import { GCodeDropzone } from "./GCodeDropzone";

interface IProps {
  UIStore: UIStore;
}

const StaticGCodeViewer = observer(
  ({
    UIStore: { activeGCode, activeLayer, transform, setTransform, drawSettings }
  }: IProps) => {
    if (activeGCode) {
      return (
        <GCodeViewer
          from={activeGCode.layerPositions[activeLayer]}
          to={activeGCode.layerPositions[activeLayer + 1]}
          activeGCode={activeGCode}
          transform={transform}
          setTransform={setTransform}
          drawSettings={drawSettings}
        />
      );
    } else return GCodeDropzone();
  }
);
export default StaticGCodeViewer;
