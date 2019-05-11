import * as React from "react";
import { observer } from "mobx-react";
import { FileInput } from "@blueprintjs/core";
import UIStore from "app/UIStore";
import GCodeParser from "app/gcode-parser";

interface IProps {}

@observer
export default class GCodeUpload extends React.Component<IProps> {
  onUpload(e: any) {
    if (e.nativeEvent.target) {
      let file: File = e.nativeEvent.target.files[0];
      const reader = new FileReader();
      let offset = 0;

      const parser = new GCodeParser();

      function readSlice() {
        let s = file.slice(offset, offset + 1024 * 1024);
        reader.readAsArrayBuffer(s);
      }

      reader.onload = x => {
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
          UIStore.setActiveGCode({
            name: "Test2",
            numberOfLayers: parsingResult.layerPositions.length,
            ...parsingResult,
          });
        }
      };

      const t0 = performance.now();
      readSlice();
    }
  }
  render() {
    return <FileInput onInputChange={this.onUpload} />;
  }
}
