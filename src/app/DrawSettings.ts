import { useState } from "react";
import produce from "immer";

export interface IDrawSettings {
  lineWidth: number;
  coloringMode: string; // "feed_rate" | "tool";
  toolColors: string[];
  scaleLinewidth: boolean;
  drawPreviousLayers: number;
}

export type IDrawSettingsAccess = <K extends keyof IDrawSettings>(
  name: K,
  value: IDrawSettings[K]
) => void;

const defaultDrawSettings: IDrawSettings = {
  lineWidth: 8,
  coloringMode: "feed_rate",
  toolColors: ["blue", "green", "red", "orange", "black"],
  scaleLinewidth: true,
  drawPreviousLayers: 2
};

function updateSettings(
  updateFunction: (settings: IDrawSettings) => void,
  oldSettings: IDrawSettings
) {
  return function<K extends keyof IDrawSettings>(
    name: K,
    value: IDrawSettings[K]
  ) {
    const newSettings = produce(oldSettings, (draft: IDrawSettings) => {
      draft[name] = value;
    });
    updateFunction(newSettings);
  };
}

export function useDrawSettings(): [IDrawSettings, IDrawSettingsAccess] {
  const [settings, setSettings] = useState(defaultDrawSettings);
  return [settings, updateSettings(setSettings, settings)];
}
