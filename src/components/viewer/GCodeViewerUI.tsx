import "./GCodeViewer.css";

import * as React from "react";

import { Button, NumericInput } from "@blueprintjs/core";
import GCodeViewer, { ITransform } from "components/GCodeViewer";

import { GCodeDropzone } from "components/GCodeDropzone";
import { IDrawSettings } from "app/DrawSettings";
import { IGCode } from "app/UIStore";
import LayerSelectionSlider from "./LayerSelectionSlider";
import styled from "styled-components/macro";
import { useState } from "react";

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

  if (GCode === null) return <GCodeDropzone />;

  return (
    <div className="gcode-viewer_container">
      <GCodeViewer
        currentLayer={currentLayer}
        activeGCode={GCode}
        transform={transform}
        setTransform={setTransform}
        drawSettings={drawSettings}
      />
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
