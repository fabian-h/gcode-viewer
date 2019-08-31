import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { IGCode } from "app/UIStore";
import { calculateProjection } from "app/projections";

interface IProps {
  gcode: IGCode;
}

export default function ProjectionCanvas({ gcode }: IProps) {
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  let canvas = useRef<HTMLCanvasElement>(null);

  function draw() {
    console.log("DRAW");
    let { image, width, height } = calculateProjection(gcode);
    if (context) {
      context.save();
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, 300, 300);
      context.restore();
      context.scale(-1, 0);
      // create imageData object
      //let idata = context.createImageData(200, 100);
      //let buffer = new Uint8ClampedArray(100 * 200 * 4);
      let idata = context.createImageData(width, height);
      let buffer = new Uint8ClampedArray(width * height * 4);

      for (let i = 0; i < image.length; ++i) {
        buffer[i * 4] = 220 - image[image.length - i];
        buffer[i * 4 + 1] = 200 - image[image.length - i];
        buffer[i * 4 + 2] = 200 - image[image.length - i];
        buffer[i * 4 + 3] = 255;
      }
      console.log(idata, buffer);
      // set our buffer as source
      idata.data.set(buffer);
      console.log(idata, buffer);
      // update canvas with new data
      context.putImageData(idata, 0, 0, 0, 0, width, height);
    }
  }

  useEffect(() => {
    console.log("use effect");
    if (context) {
      console.log("effect draw");
      draw();
    } else {
      console.log("C", canvas.current);
      if (canvas.current) setContext(canvas.current.getContext("2d"));
    }
  });
  return <canvas width="250" height="200" ref={canvas}></canvas>;
}
