import GCodeParser from "./gcode-parser";
import { IGCode } from "./UIStore";

export function uploadGCodeFiles(files: FileList): Promise<IGCode> {
  return new Promise((resolve, reject) => {
    console.log("FF", files);
    let file: File = files[0];
    const reader = new FileReader();
    let offset = 0;

    const parser = new GCodeParser();
    const t0 = performance.now();

    function readSlice() {
      console.log("slice");
      let s = file.slice(offset, offset + 1024 * 1024);
      reader.readAsArrayBuffer(s);
    }

    reader.onload = () => {
      console.log("READ!!!!");
      parser.parse(reader.result as ArrayBuffer);
      offset += 1024 * 1024;
      if (offset < file.size) readSlice();
      else {
        const delta = performance.now() - t0;
        const fileSizeMB = file.size / 1024 / 1024;

        console.log(
          `Read ${fileSizeMB.toFixed(2)} megabytes in ${delta.toFixed(
            0
          )} ms. ${(delta / fileSizeMB).toFixed(0)} ms/megabyte`
        );
        const parsingResult = parser.getParsingResult();
        console.log("R", parsingResult);
        resolve({
          name: file.name,
          numberOfLayers: parsingResult.layerPositions.length,
          ...parsingResult
        });
      }
    };
    console.log("A1");
    readSlice();
    console.log("A2");
  });
}
