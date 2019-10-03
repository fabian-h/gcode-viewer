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

import { IStatistics, Instructions } from "./gcode-parser";
import { action, observable } from "mobx";

import OctoprintConnection from "./OctoprintConnection";

export class UIStore {
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
  layerBytePositions: number[];
  numberOfLayers: number;
  statistics: IStatistics;
  connection?: OctoprintConnection;
  lineIndex: number[];
  live?: boolean;
}

export interface IDrawSettings {
  lineWidth: number;
  coloringMode: string; // "feed_rate" | "tool";
  toolColors: string[];
  scaleLinewidth: boolean;
  drawPreviousLayers: number;
}
