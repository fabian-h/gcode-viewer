import * as React from "react";

import { Button, Icon } from "@blueprintjs/core";

import { IGCode } from "app/UIStore";
import { uploadGCodeFiles } from "app/file-upload";

interface IProps {
  gcodes: IGCode[];
  addGCode: (gcode: IGCode) => void;
}

export default ({ gcodes, addGCode }: IProps) => {
  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      console.log(event.target.files);
      const gcode = await uploadGCodeFiles(event.target.files);
      addGCode(gcode);
    }
  }

  return (
    <div className="gcode-viewer_selection-bar">
      {gcodes.map(gcode => {
        return (
          <Button intent="primary" className="gcode-viewer_gcode">
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
