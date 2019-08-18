import "./GCodeViewer.css";

import * as React from "react";

import { Button, NumericInput } from "@blueprintjs/core";
import { GCodeContext, useGCodeContext } from "app/GCodeProvider";
import GCodeViewer, { ITransform } from "components/GCodeViewer";
import { useContext, useEffect, useState } from "react";

import { GCodeDropzone } from "components/GCodeDropzone";
import { IDrawSettings } from "app/DrawSettings";
import { IGCode } from "app/UIStore";
import LayerSelectionSlider from "./LayerSelectionSlider";
import SelectionBar from "./SelectionBar";

/*
const ContainerDiv = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const StyledGCodeViewer = styled(GCodeViewer)`
  min-height: 0;
`;

const ToolbarDiv = styled.div`
  flex: 0 0 auto;
  padding: 5px;
  display: flex;
  flex-direction: row;
`;

const FlexItemButton = styled(Button)`
  flex: 0 0 auto;
  margin: 0 5px;
`;

const FlexItemContainer = styled.div`
  flex: 0 0 auto;
  margin: 0 5px;
`;

const FlexItemContainerGrow = styled.div`
  flex: 1;
  margin: 0 5px;
`;*/

interface IProps {
  GCode: IGCode | null;
  drawSettings: IDrawSettings;
}

export default ({ GCode, drawSettings }: IProps) => {
  const [currentLayer, setCurrentLayer] = useState<number>(1);
  const [transform, setTransform] = useState<ITransform>({ k: 1, x: 0, y: 0 });
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  const GCodeStore = useGCodeContext();
  console.log("store", GCodeStore);

  useEffect(() => {
    if (GCode !== null) {
      const initialTransform = calculateTransfromFromCoordinates(
        GCode.statistics.x.min,
        GCode.statistics.x.max,
        GCode.statistics.y.min,
        GCode.statistics.y.max,
        width,
        height
      );

      setTransform(initialTransform);
    }
  }, [GCode, width, height]);

  if (GCode === null) return <GCodeDropzone />;

  return (
    <div className="gcode-viewer_container">
      <SelectionBar gcodes={GCodeStore.gcodes} addGCode={GCodeStore.addGCode} />
      <GCodeViewer
        currentLayer={currentLayer}
        activeGCode={GCode}
        transform={transform}
        setTransform={setTransform}
        drawSettings={drawSettings}
        setWidth={setWidth}
        setHeight={setHeight}
      />
      <div className="gcode-viewer_overlay">
        Layer {currentLayer}
        <br />
        Layer height: {GCode.layerHeights[currentLayer].toFixed(2)} mm
      </div>
      <div className="gcode-viewer_toolbar-container">
        <Button
          className="gcode-viewer_toolbar-button"
          intent="primary"
          onClick={() => setTransform({ k: 1, x: 0, y: 0 })}
        >
          Reset Zoom
        </Button>

        <div className="gcode-viewer_toolbar-flex-grow">
          <LayerSelectionSlider
            currentLayer={currentLayer}
            numberOfLayers={GCode.numberOfLayers}
            setCurrentLayer={setCurrentLayer}
          />
        </div>
        <div className="gcode-viewer_toolbar-layer-input">
          <NumericInput
            min={0}
            max={GCode.numberOfLayers}
            onValueChange={value => setCurrentLayer(value)}
            value={currentLayer}
          />
        </div>
      </div>
    </div>
  );
};

function calculateTransfromFromCoordinates(
  xmin: number,
  xmax: number,
  ymin: number,
  ymax: number,
  width: number,
  height: number
) {
  const dx = xmax - xmin;
  const dy = ymax - ymin;
  const x = (xmin + xmax) / 2;
  const y = (ymin + ymax) / 2;

  const scale = Math.max(1, 0.9 / Math.max(dx / width, dy / height));
  const translate = [width / 2 - scale * x, height / 2 - scale * y];
  return {
    k: scale,
    x: translate[0],
    y: translate[1]
  };
}
