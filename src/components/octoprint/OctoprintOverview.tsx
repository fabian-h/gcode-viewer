import { Button, Card } from "@blueprintjs/core";
import OctoprintStore, { IOctoprintServer } from "app/OctoprintStore";

import GCodeParser from "app/gcode-parser";
import OctoprintConnection from "app/OctoprintConnection";
import React from "react";
import UIStore from "app/UIStore";
import { observer } from "mobx-react-lite";
import styled from "styled-components/macro";

interface IProps {}

const StyledCard = styled(Card)`
  padding: 5px;
`;

const OverviewContainer = styled.div`
  position: absolute;
  right: 15px;
  top: 65px;
`;

async function handlePreview(connection: OctoprintConnection) {
  const t0 = performance.now();
  const response = await connection.getCurrentFile();
  if (response && response.body && response.status === 200) {
    const parser = new GCodeParser();
    let bytesReceived = 0;
    const reader = response.body.getReader();
    while (true) {
      let result = await reader.read();

      if (result.done) break;
      parser.parse(result.value as ArrayBuffer);
      bytesReceived += result.value.length;
    }
    const delta = performance.now() - t0;
    const fileSizeMB = bytesReceived / 1024 / 1024;
    console.log(
      `Read ${fileSizeMB.toFixed(2)} megabytes in ${delta.toFixed(0)} ms. ${(
        delta / fileSizeMB
      ).toFixed(0)} ms/megabyte`
    );
    const parsingResult = parser.getParsingResult();
    UIStore.setActiveGCode({
      name: "test",
      numberOfLayers: parsingResult.layerPositions.length,
      connection: connection,
      live: true,
      ...parsingResult
    });
  }
}

const OctoprintOverview = observer(() => {
  return (
    <OverviewContainer>
      {OctoprintStore.servers.map(({ config, connection }, index) => (
        <StyledCard key={index}>
          <p>{config.name}</p>
          {connection ? <p>{connection.status}</p> : <p>unknown</p>}
          {connection && connection.progress ? (
            <>
              <p>Completion: {connection.progress.completion.toFixed(0)}</p>
              <Button
                intent="success"
                onClick={() => handlePreview(connection)}
              >
                Live preview
              </Button>
            </>
          ) : null}
        </StyledCard>
      ))}
    </OverviewContainer>
  );
});
export default OctoprintOverview;
