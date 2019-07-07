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

import GCodeParser from "./gcode-parser";
import { IGCode } from "./UIStore";

export function uploadGCodeFiles(files: FileList): Promise<IGCode> {
  return new Promise((resolve, reject) => {
    let file: File = files[0];
    const reader = new FileReader();
    let offset = 0;

    const parser = new GCodeParser();
    const t0 = performance.now();

    function readSlice() {
      let s = file.slice(offset, offset + 1024 * 1024);
      reader.readAsArrayBuffer(s);
    }

    reader.onload = () => {
      parser.parse(reader.result as ArrayBuffer);
      offset += 1024 * 1024;
      if (offset < file.size) readSlice();
      else {
        const delta = performance.now() - t0;
        const fileSizeMB = file.size / 1024 / 1024;

        console.log(
          `Read ${fileSizeMB.toFixed(2)} megabytes in ${delta.toFixed(
            0
          )} ms. ${(delta / fileSizeMB).toFixed(0)} ms/megabyte ${(
            1000 /
            (delta / fileSizeMB)
          ).toFixed(1)} megabyte/s`
        );
        const parsingResult = parser.getParsingResult();
        resolve({
          name: file.name,
          numberOfLayers: parsingResult.layerPositions.length,
          ...parsingResult
        });
      }
    };
    readSlice();
  });
}
