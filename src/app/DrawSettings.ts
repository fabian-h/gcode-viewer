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
    let newSettings: IDrawSettings = { ...oldSettings };
    newSettings[name] = value;
    updateFunction(newSettings);
  };

  //return produce(oldSettings, settings => settings[name] = value);
}

export function useDrawSettings(): [IDrawSettings, IDrawSettingsAccess] {
  const [settings, setSettings] = useState(defaultDrawSettings);
  const [rv1, rv2] = [settings, updateSettings(setSettings, settings)];
  return [rv1, rv2];
}
