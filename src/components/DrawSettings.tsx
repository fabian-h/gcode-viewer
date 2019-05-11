import * as React from "react";
import { Button, Drawer, Classes, NumericInput } from "@blueprintjs/core";
import { useState } from "react";
import { IDrawSettings } from "app/UIStore";
import { observer } from "mobx-react-lite";
import { action } from "mobx";

interface IDrawSettingsButtonProps {
  drawSettings: IDrawSettings;
  setDrawSetting: (setting: keyof IDrawSettings, value: any) => void;
}

const DrawSettingsButton = observer((props: IDrawSettingsButtonProps) => {
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
});
export default DrawSettingsButton;

const SettingsDrawer = observer(
  ({
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
  }
);

const DrawSettings = observer(
  ({ drawSettings, setDrawSetting }: IDrawSettingsButtonProps) => {
    return (
      <div>
        <NumericInput
          value={drawSettings.lineWidth}
          onValueChange={action(
            "set line width",
            (newValue: any) => (drawSettings.lineWidth = newValue)
          )}
        />
      </div>
    );
  }
);
