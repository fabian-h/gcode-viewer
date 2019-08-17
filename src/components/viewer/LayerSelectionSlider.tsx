import * as React from "react";

import { Slider } from "@blueprintjs/core";

interface IProps {
  currentLayer: number;
  numberOfLayers: number;
  setCurrentLayer: (n: number) => void;
}

export default ({ currentLayer, numberOfLayers, setCurrentLayer }: IProps) => (
  <Slider
    value={currentLayer}
    min={0}
    max={numberOfLayers - 2}
    labelStepSize={Math.ceil(numberOfLayers / 200) * 10}
    onChange={n => setCurrentLayer(n)}
  />
);
