import { IGCode } from "./UIStore";
import { COMMANDS } from "./gcode-parser";

export function calculateProjection(gcode: IGCode) {
  const { instructions, statistics } = gcode;
  const aspectRatio = (statistics.x.max - statistics.x.min) / statistics.z.max;

  const width = 200;
  const height = Math.floor(width / aspectRatio);
  const image = new Uint8Array(width * height);

  let x = 0;
  let y = 0;
  let z = 0;
  let h = 0;

  const max = statistics.x.max;
  const min = statistics.x.min;

  const t0 = performance.now();
  //console.log(instructions.buffers.length);
  for (let i = 0; i < instructions.buffers.length; ++i) {
    let f32 = new Float32Array(instructions.buffers[i]);
    for (let j = 0; j < f32.length; j += 3) {
      if ((f32[j] & 255) === COMMANDS.LAYER_CHANGE) {
        z = f32[j + 2];
        h = Math.floor((z / statistics.z.max) * height);
        //console.log("L", f32[j + 1], z.toFixed(2), h);
      } else if ((f32[j] & 255) === COMMANDS.MOVE_WITHOUT_EXTRUSION) {
        x = f32[j + 1];
        y = f32[j + 2];
      } else if ((f32[j] & 255) === COMMANDS.MOVE_WITH_EXTRUSION) {
        let left = Math.floor(((x - min) / (max - min)) * width);
        let right = Math.ceil(((f32[j + 1] - min) / (max - min)) * width);
        if (left > right) [left, right] = [right, left];

        for (let k = left; k <= right; k++) image[h * width + k] = 100;
        x = f32[j + 1];
        y = f32[j + 2];
      }
    }
  }
  //console.log("image", image);
  const t1 = performance.now();
  console.log("projection rendering time: ", t1 - t0);
  return {
    width: width,
    height: height,
    image: image
  };
}
