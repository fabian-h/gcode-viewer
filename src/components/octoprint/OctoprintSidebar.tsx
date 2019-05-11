import { observer } from "mobx-react";
import React from "react";
import OctoprintStore, { IOctoprintServer } from "app/OctoprintStore";
import { Card, Button } from "@blueprintjs/core";
import styled from "styled-components";
import OctoprintConnection from "app/OctoprintConnection";
import UIStore from "app/UIStore";
import GCodeParser from "app/gcode-parser";

interface IProps {}

const StyledCard = styled(Card)`
  margin: 5px;
`;

const StyledH3 = styled.h3`
  margin: 5px;
`;

@observer
export default class OctoprintSidebar extends React.Component<IProps> {
  private async handlePreview(connection: OctoprintConnection) {
    const t0 = performance.now();
    const response = await connection.getCurrentFile();

    if (response && response.body) {
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
        name: "Test2",
        numberOfLayers: parsingResult.layerPositions.length,
        connection: connection,
        ...parsingResult,
      });
    }
  }

  render() {
    return (
      <>
        <StyledH3>Octoprint servers</StyledH3>
        {OctoprintStore.servers.map(({ config, connection }, index) => (
          <StyledCard key={index}>
            <p>{config.name}</p>
            {connection ? <p>{connection.status}</p> : <p>unknown</p>}
            {connection && connection.progress ? (
              <>
                <p>Completion: {connection.progress.completion.toFixed(0)}</p>
                <Button
                  intent="success"
                  onClick={() => this.handlePreview(connection)}
                >
                  Live preview
                </Button>
              </>
            ) : null}
          </StyledCard>
        ))}
      </>
    );
  }
}
