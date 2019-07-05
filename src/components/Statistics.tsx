import * as React from "react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Button, Dialog } from "@blueprintjs/core";
import { IStatistics } from "app/gcode-parser";

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

const StatisticsModal = observer(
  ({ statistics }: { statistics: IStatistics }) => {
    const [isOpen, setOpen] = useState(false);

    return (
      <>
        <Button
          className="bp3"
          text="Statistics"
          onClick={() => setOpen(true)}
        />
        <Dialog
          isOpen={isOpen}
          icon="cloud-download"
          title="Statistics"
          onClose={() => setOpen(false)}
        >
          <h2>Dimensions</h2>
          <p>
            {(statistics.x.max - statistics.x.min).toFixed(2)} x
            {(statistics.y.max - statistics.y.min).toFixed(2)} mm
          </p>
          <h2>Feed rate</h2>
          <p>
            {statistics.feed_rate.min.toFixed(0)} -{" "}
            {statistics.feed_rate.max.toFixed(0)} feed rate
          </p>
          <p>
            {statistics.extruded_feed_rate.min.toFixed(0)} -{" "}
            {statistics.extruded_feed_rate.max.toFixed(0)} feed rate while
            extruding
          </p>
        </Dialog>
      </>
    );
  }
);
export default StatisticsModal;
