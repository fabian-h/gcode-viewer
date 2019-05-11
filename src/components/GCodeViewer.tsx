import * as React from "react";
import { Instructions, COMMANDS } from "app/gcode-parser";
import { zoom, zoomIdentity } from "d3-zoom";
import { select, event, TransitionLike } from "d3-selection";
import { scaleLinear } from "d3-scale";
import { interpolateInferno } from "d3-scale-chromatic";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { IGCode, IDrawSettings } from "app/UIStore";
import { toJS, action, set } from "mobx";
import { useState, useEffect, createRef, useRef } from "react";
import ReactDOM from "react-dom";
import { ResizeSensor } from "@blueprintjs/core";

const StyledCanvas = styled.canvas`
  flex: 1;
`;

interface IProps {
  from: number;
  to: number;
  activeGCode: IGCode | null;
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
    from,
    to,
    activeGCode,
    transform,
    setTransform,
    drawSettings,
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
      const x = drawSettings.lineWidth;
      clearCanvas(canvas.current, context);
      drawInstructions(
        context,
        from,
        to,
        activeGCode.instructions,
        transform,
        devicePixelRatio,
        drawSettings
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

    return (
      <>
        <ResizeSensor onResize={handleResize}>
          <StyledCanvas ref={canvas} />
        </ResizeSensor>
        <div>
          {drawSettings.lineWidth}
          {transform.x}
        </div>
      </>
    );
  }
);
export default GCodeViewer;

function drawInstructions(
  context: CanvasRenderingContext2D,
  from: number,
  to: number,
  instructions: Instructions,
  transform: any,
  devicePixelRatio: number,
  drawSettings: IDrawSettings
) {
  const feedRateScale = scaleLinear()
    .domain([900, 11054.3])
    .range([0, 0.75]);

  let prevX = 0;
  let prevY = 0;

  context.setTransform(
    transform.k * devicePixelRatio,
    0,
    0,
    transform.k * devicePixelRatio,
    transform.x * devicePixelRatio,
    transform.y * devicePixelRatio
  );
  context.lineWidth = drawSettings.lineWidth / transform.k;
  context.lineCap = "round";
  context.beginPath();

  const firstBuffer = Math.floor(from / instructions.blockSizeInInstructions);
  const lastBuffer = Math.floor(to / instructions.blockSizeInInstructions);

  let currentF32Buffer;
  let command;
  let param1, param2;

  for (let i = firstBuffer; i <= lastBuffer; ++i) {
    currentF32Buffer = new Float32Array(instructions.buffers[i]);

    let offset = from - i * instructions.blockSizeInInstructions;
    let end = to - i * instructions.blockSizeInInstructions;

    for (let j = offset * 3; j < end * 3; j += 3) {
      command = currentF32Buffer[j];
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
          context.stroke();
          context.beginPath();
          context.moveTo(prevX, prevY);
          context.strokeStyle = interpolateInferno(feedRateScale(param1));
          break;
      }
    }
  }
  context.stroke();

  /*for (let i = from; i < to; ++i) {
    let command = instructions.i8[i * 16];
    let v1 = instructions.f32[i * 4 + 1];
    let v2 = instructions.f32[i * 4 + 2];
    if (command === 1) {
      context.moveTo(v1, v2);
      prevX = v1;
      prevY = v2;
    } else if (command === 2) {
      context.lineTo(v1, v2);
      prevX = v1;
      prevY = v2;
    } else if (command === 3) {
      context.stroke();
      context.beginPath();
      context.moveTo(prevX, prevY);
      context.strokeStyle = interpolateInferno(
        feedRateScale(instructions.f32[i * 4 + 1])
      );
    }
  }
  context.stroke();*/
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
