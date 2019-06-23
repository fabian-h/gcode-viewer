import { observable, action, computed, set, get, spy } from "mobx";
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
    lineWidth: 2
  };

  @action.bound
  setDrawSetting(setting: keyof IDrawSettings, value: any) {
    this.drawSettings[setting] = value;
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
  numberOfLayers: number;
  statistics: IStatistics;
  connection?: OctoprintConnection;
  lineIndex: number[];
}

export interface IDrawSettings {
  lineWidth: number;
}
