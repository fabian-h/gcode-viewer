import * as React from "react";

import { Button, Icon } from "@blueprintjs/core";

import { IGCode } from "app/UIStore";
import { Machine } from "xstate";
import { uploadGCodeFiles } from "app/file-upload";

interface IProps {
  gcodes: IGCode[];
  addGCode: (gcode: IGCode) => void;
  setCurentGCodeIndex: (index: number) => void;
}

const SelectionBar = ({ gcodes, addGCode, setCurentGCodeIndex }: IProps) => {
  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      console.log(event.target.files);
      const gcode = await uploadGCodeFiles(event.target.files);
      addGCode(gcode);
    }
  }

  return (
    <div className="gcode-viewer_selection-bar">
      {gcodes.map((gcode, index) => {
        return (
          <Button
            key={index}
            intent="primary"
            className="gcode-viewer_gcode"
            onClick={() => setCurentGCodeIndex(index)}
          >
            {gcode.name}
          </Button>
        );
      })}

      <label htmlFor="file-upload" className="custom-file-upload">
        <Icon intent="primary" icon="plus" iconSize={20} />
      </label>
      <input id="file-upload" type="file" onChange={handleFileUpload} />
    </div>
  );
};
export default SelectionBar;
