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
import { Instructions, COMMANDS, IStatistics } from "app/gcode-parser";
import { zoom } from "d3-zoom";
import { select, event } from "d3-selection";
import { scaleLinear } from "d3-scale";
import { interpolateInferno } from "d3-scale-chromatic";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { IGCode, IDrawSettings } from "app/UIStore";
import { action } from "mobx";
import { useState, useEffect, useRef } from "react";
import { ResizeSensor } from "@blueprintjs/core";

const StyledCanvas = styled.canvas`
  flex: 1;
`;

const OverlayDiv = styled.div`
  position: absolute;
  padding: 5px;
  background-color: transparent;
`;

interface IProps {
  currentLayer: number;
  bytesToDraw?: number;
  activeGCode: IGCode;
  transform: ITransform;
  setTransform: (newTransfrom: ITransform) => void;
  drawSettings: IDrawSettings;
}

export interface ITransform {
  k: number;
  x: number;
  y: number;
}

const GCodeViewer = observer(
  ({
    currentLayer,
    bytesToDraw,
    activeGCode,
    transform,
    setTransform,
    drawSettings
  }: IProps) => {
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(
      null
    );

    let canvas = useRef<HTMLCanvasElement>(null);

    const doZoom = action("update transform", () => {
      /*const { k, x, y } = event.transform;
      set(transform, "x", x);
      set(transform, "y", y);
      set(transform, "k", k);
      transform.x = x;
      transform.y = y;
      transform.k = k;*/
      //transform = { k, x, y };
      setTransform(event.transform);
    });

    function draw() {
      if (canvas.current === null || context === null || activeGCode === null) {
        return;
      }

      clearCanvas(canvas.current, context);
      drawInstructions(
        context,
        currentLayer,
        bytesToDraw ? bytesToDraw : undefined,
        activeGCode,
        transform,
        devicePixelRatio,
        drawSettings,
        activeGCode.statistics
      );
    }

    function handleResize() {
      if (canvas.current === null) return;

      const currentHeight = canvas.current.clientHeight;
      const currentWidth = canvas.current.clientWidth;
      var devicePixelRatio = window.devicePixelRatio || 1;
      if (
        canvas.current.width !== currentWidth * devicePixelRatio ||
        canvas.current.height !== currentHeight * devicePixelRatio
      ) {
        canvas.current.width = currentWidth * devicePixelRatio;
        canvas.current.height = currentHeight * devicePixelRatio;
      }
      draw();
    }

    useEffect(() => {
      if (context) {
        draw();
      } else {
        if (canvas.current) setContext(canvas.current.getContext("2d"));

        const zoomBehaviour = zoom()
          .on("zoom", doZoom)
          .scaleExtent([1, 128]);

        if (canvas.current !== null)
          zoomBehaviour(select(canvas.current as any));

        //handleResize();
      }
    });

    // hack to get mobx to notice we use this Observable
    var tmp = drawSettings.lineWidth;
    var tmp2 = drawSettings.coloringMode;
    var tmp3 = drawSettings.scaleLinewidth;

    return (
      <ResizeSensor onResize={handleResize}>
        <>
          <OverlayDiv>
            Layer {currentLayer}
            <br />
            Layer height: {activeGCode.layerHeights[currentLayer].toFixed(2)}
          </OverlayDiv>
          <StyledCanvas ref={canvas} />
        </>
      </ResizeSensor>
    );
  }
);
export default GCodeViewer;

function drawInstructions(
  context: CanvasRenderingContext2D,
  layer: number,
  bytesToDraw: number | undefined,
  activeGCode: IGCode,
  transform: any,
  devicePixelRatio: number,
  drawSettings: IDrawSettings,
  statistics: IStatistics
) {
  const instructions = activeGCode.instructions;

  context.setTransform(
    transform.k * devicePixelRatio,
    0,
    0,
    transform.k * devicePixelRatio,
    transform.x * devicePixelRatio,
    transform.y * devicePixelRatio
  );
  if (drawSettings.scaleLinewidth) {
    context.lineWidth = drawSettings.lineWidth / 50;
  } else {
    context.lineWidth = drawSettings.lineWidth / transform.k;
  }

  context.lineCap = "round";
  drawLayer(
    context,
    instructions,
    activeGCode.layerPositions[layer],
    activeGCode.layerPositions[layer + 1],
    drawSettings,
    statistics,
    undefined,
    bytesToDraw
  );
}

function drawLayer(
  context: CanvasRenderingContext2D,
  instructions: Instructions,
  from: number,
  to: number,
  drawSettings: IDrawSettings,
  statistics: IStatistics,
  overrideColor: string | undefined,
  bytesToDraw: number | undefined
) {
  let prevX = 0;
  let prevY = 0;

  const feedRateScale = scaleLinear()
    .domain([
      statistics.extruded_feed_rate.min,
      statistics.extruded_feed_rate.max
    ])
    .range([0, 0.8]);
  context.beginPath();

  const firstBuffer = Math.floor(from / instructions.blockSizeInInstructions);
  const lastBuffer = Math.floor(to / instructions.blockSizeInInstructions);

  let currentF32Buffer;
  let command;
  let param1, param2;

  let bytesDrawn = 0;

  for (let i = firstBuffer; i <= lastBuffer; ++i) {
    currentF32Buffer = new Float32Array(instructions.buffers[i]);

    let offset = from - i * instructions.blockSizeInInstructions;
    let end = to - i * instructions.blockSizeInInstructions;

    for (let j = offset * 3; j < end * 3; j += 3) {
      command = currentF32Buffer[j] & 255;
      if (bytesToDraw !== undefined) {
        bytesDrawn += (currentF32Buffer[j] & 4294967041) >> 8;
        if (bytesDrawn > bytesToDraw && !overrideColor) {
          context.stroke();
          context.beginPath();
          context.moveTo(prevX, prevY);
          overrideColor = "#ddd";
          context.lineWidth = context.lineWidth / 2;
          context.strokeStyle = overrideColor;
        }
      }
      param1 = currentF32Buffer[j + 1];
      param2 = currentF32Buffer[j + 2];

      switch (command) {
        case COMMANDS.MOVE_WITHOUT_EXTRUSION:
          context.moveTo(param1, param2);
          prevX = param1;
          prevY = param2;
          break;
        case COMMANDS.MOVE_WITH_EXTRUSION:
          context.lineTo(param1, param2);
          prevX = param1;
          prevY = param2;
          break;
        case COMMANDS.SET_FEED_RATE:
          if (drawSettings.coloringMode === "feed_rate" && !overrideColor) {
            context.stroke();
            context.beginPath();
            context.moveTo(prevX, prevY);
            context.strokeStyle = interpolateInferno(feedRateScale(param1));
          }
          break;
        case COMMANDS.TOOL_CHANGE:
          if (drawSettings.coloringMode === "tool" && !overrideColor) {
            context.stroke();
            context.beginPath();
            context.moveTo(prevX, prevY);

            var color = drawSettings.toolColors[param1];
            if (color) {
              context.strokeStyle = color;
            } else context.strokeStyle = "grey";
          }
          break;
      }
    }
  }
  context.stroke();
}

function clearCanvas(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D
) {
  context.save();
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.restore();
}
