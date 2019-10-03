import "./GCodeViewer.css";

import * as React from "react";

import { Button, NumericInput } from "@blueprintjs/core";
import GCodeViewer, { ITransform } from "components/GCodeViewer";
import { useEffect, useReducer, useState } from "react";

import { GCodeDropzone } from "components/GCodeDropzone";
import { IDrawSettings } from "app/DrawSettings";
import { IGCode } from "app/UIStore";
import LayerSelectionSlider from "./LayerSelectionSlider";
import { Machine } from "xstate";
import SelectionBar from "./SelectionBar";
import produce from "immer";
import { useGCodeContext } from "app/GCodeProvider";
import { useMachine } from "@xstate/react";

interface UISchema {
  states: {
    empty: {};
    active: {};
  };
}

interface UIContext {}

type UIEvent = { type: "ADD" };

const UIMachine = Machine<UIContext, UISchema, UIEvent>({
  id: "gcode_ui",
  strict: true,
  initial: "empty",
  context: {},
  states: {
    empty: {
      on: {
        ADD: "active"
      }
    },
    active: {
      on: {
        ADD: "active"
      }
    }
  }
});

function currentLayerReducer(
  state: number[],
  action: { index: number; layer: number }
) {
  var rv = produce(state, draft => {
    draft[action.index] = action.layer;
  });
  return rv;
}

function useCurrentLayer(): [
  (index: number) => number,
  (index: number, layer: number) => void
] {
  const [currentLayers, setCurrentLayers] = useReducer(currentLayerReducer, []);
  const getCurrentLayer = (index: number) =>
    currentLayers[index] ? currentLayers[index] : 1;
  const setCurrentLayer = (index: number, layer: number) => {
    console.log("set", index, layer);
    setCurrentLayers({ index, layer });
  };
  return [getCurrentLayer, setCurrentLayer];
}

interface IProps {
  drawSettings: IDrawSettings;
}

const GCodeViewerUI = ({ drawSettings }: IProps) => {
  const [currentState, send] = useMachine(UIMachine, { devTools: true });

  //const [currentLayer, setCurrentLayer] = useState<number>(1);
  const [currentLayers, setCurrentLayer] = useCurrentLayer();
  const [transform, setTransform] = useState<ITransform>({ k: 1, x: 0, y: 0 });
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [currentGCodeIndex, setCurentGCodeIndex] = useState<number>(0);

  const GCodeStore = useGCodeContext();

  const GCode = GCodeStore.gcodes[currentGCodeIndex];
  useEffect(() => {
    if (GCode !== undefined) {
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

  if (GCode === undefined)
    return <GCodeDropzone onFileLoad={() => send("ADD")} />;

  return (
    <div className="gcode-viewer_container">
      <SelectionBar
        gcodes={GCodeStore.gcodes}
        addGCode={(gcode: IGCode) => {
          console.log("ADDDD");
          send({ type: "ADD" });
        }}
        setCurentGCodeIndex={() => {
          console.log("ADDDD222");
          send({ type: "ADD" });
        }}
      />
      {currentState.matches("active") && <p>Active</p>}
      <GCodeViewer
        currentLayer={currentLayers(currentGCodeIndex)}
        activeGCode={GCode}
        transform={transform}
        setTransform={setTransform}
        drawSettings={drawSettings}
        setWidth={setWidth}
        setHeight={setHeight}
      />
      <div className="gcode-viewer_overlay">
        Layer {currentLayers(currentGCodeIndex)}
        <br />
        Layer height:{" "}
        {GCode.layerHeights[currentLayers(currentGCodeIndex)].toFixed(2)} mm
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
            currentLayer={currentLayers(currentGCodeIndex)}
            numberOfLayers={GCode.numberOfLayers}
            setCurrentLayer={layer => {
              console.log("slider", currentGCodeIndex, layer);
              setCurrentLayer(currentGCodeIndex, layer);
            }}
          />
        </div>
        <div className="gcode-viewer_toolbar-layer-input">
          <NumericInput
            min={0}
            max={GCode.numberOfLayers}
            onValueChange={layer => {
              console.log("numeric", currentGCodeIndex, layer);
              setCurrentLayer(currentGCodeIndex, layer);
            }}
            value={currentLayers(currentGCodeIndex)}
          />
        </div>
      </div>
    </div>
  );
};
export default GCodeViewerUI;

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
