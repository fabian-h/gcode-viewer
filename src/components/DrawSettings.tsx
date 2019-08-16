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
import {
  Button,
  Drawer,
  Classes,
  NumericInput,
  FormGroup,
  RadioGroup,
  Radio,
  Checkbox
} from "@blueprintjs/core";
import { useState } from "react";
import { IDrawSettings } from "app/DrawSettings";
import { IDrawSettingsAccess } from "app/DrawSettings";

interface IDrawSettingsButtonProps {
  drawSettings: IDrawSettings;
  setDrawSetting: IDrawSettingsAccess;
}

const DrawSettingsButton = (props: IDrawSettingsButtonProps) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Button
        className="bp3-minimal"
        icon="cog"
        text="Draw settings"
        onClick={() => setOpen(true)}
      />
      <SettingsDrawer
        isOpen={isOpen}
        handleClose={() => setOpen(false)}
        {...props}
      />
    </>
  );
};
export default DrawSettingsButton;

const SettingsDrawer = ({
  isOpen,
  handleClose,
  ...props
}: {
  isOpen: boolean;
  handleClose: () => void;
  drawSettings: IDrawSettings;
  setDrawSetting: (setting: keyof IDrawSettings, value: any) => void;
}) => {
  return (
    <Drawer
      isOpen={isOpen}
      icon="cog"
      size="20%"
      hasBackdrop={false}
      onClose={handleClose}
      title="Draw Settings"
    >
      <div className={Classes.DRAWER_BODY}>
        <div className={Classes.DIALOG_BODY}>
          <DrawSettings {...props} />
        </div>
      </div>
    </Drawer>
  );
};

const DrawSettings = ({
  drawSettings,
  setDrawSetting
}: IDrawSettingsButtonProps) => {
  return (
    <div>
      <FormGroup label="Linewidth" labelFor="linewidth-input">
        <NumericInput
          value={drawSettings.lineWidth}
          id="linewidth-input"
          onValueChange={newValue => setDrawSetting("lineWidth", newValue)}
        />
      </FormGroup>
      <Checkbox
        checked={drawSettings.scaleLinewidth}
        label="Scale linewidth with zoom"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setDrawSetting("scaleLinewidth", event.target.checked)
        }
      />
      <RadioGroup
        label="Coloring mode"
        selectedValue={drawSettings.coloringMode}
        onChange={(event: any) =>
          setDrawSetting("coloringMode", event.target.value)
        }
      >
        <Radio label="by feed rate" value="feed_rate" />
        <Radio label="by tool" value="tool" />
      </RadioGroup>
    </div>
  );
};
