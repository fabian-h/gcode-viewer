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

import { observable, action, computed } from "mobx";
import { Instructions, IStatistics } from "./gcode-parser";
import { ITransform } from "components/GCodeViewer";
import OctoprintConnection from "./OctoprintConnection";

export class UIStore {
  @observable
  transform: ITransform = { k: 1, x: 0, y: 0 };

  @observable
  activeLayer: number = 0;

  @observable
  trackProgress: boolean = false;

  @observable
  drawSettings: IDrawSettings = {
    lineWidth: 8,
    coloringMode: "feed_rate",
    toolColors: ["blue", "green", "red", "orange", "black"],
    scaleLinewidth: true,
    drawPreviousLayers: 2
  };

  @action.bound
  setDrawSetting(setting: keyof IDrawSettings, value: any) {
    //this.drawSettings[setting] = value;
  }

  @computed
  get numberOfLayers() {
    return this.activeGCode === null ? 0 : this.activeGCode.numberOfLayers;
  }

  @action
  setActiveLayer(n: number) {
    this.activeLayer = n;
  }

  @action.bound
  setTransform(newTransform: ITransform) {
    this.transform = newTransform;
  }

  @action
  setActiveGCode(gcode: IGCode | null) {
    /*if (gcode) {
      this.setTransform({
        k: 3,
        x: gcode.statistics.x.min || 0,
        y: gcode.statistics.y.min || 0,
      });
    }*/
    this.activeGCode = gcode;
    this.activeLayer = 1;
  }

  @observable.ref
  activeGCode: IGCode | null = null;
}

const store = new UIStore();
export default store;

export interface IGCode {
  name: string;
  instructions: Instructions;
  layerPositions: number[];
  layerHeights: number[];
  numberOfLayers: number;
  statistics: IStatistics;
  connection?: OctoprintConnection;
  lineIndex: number[];
}

export interface IDrawSettings {
  lineWidth: number;
  coloringMode: string; // "feed_rate" | "tool";
  toolColors: string[];
  scaleLinewidth: boolean;
  drawPreviousLayers: number;
}
