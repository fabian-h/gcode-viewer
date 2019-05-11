import * as React from "react";
import { UIStore, IGCode } from "app/UIStore";
import GCodeViewer from "./GCodeViewer";
import { toJS } from "mobx";
import { observer } from "mobx-react";

interface IProps {
  UIStore: UIStore;
}

const StaticGCodeViewer = observer(
  ({
    UIStore: {
      activeGCode,
      activeLayer,
      transform,
      setTransform,
      drawSettings,
    },
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
    } else return <div>No GCode</div>;
  }
);
export default StaticGCodeViewer;
