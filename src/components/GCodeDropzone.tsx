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

import React, { useCallback } from "react";

import UIStore from "app/UIStore";
import styled from "styled-components/macro";
import { uploadGCodeFiles } from "app/file-upload";
import { useDropzone } from "react-dropzone";
import { useGCodeContext } from "app/GCodeProvider";

const DropzoneContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 20px;
  margin: 10px;
  border-width: 4px;
  border-radius: 2px;
  border-color: #bbb;
  border-style: dashed;
  background-color: #fafafa;
  color: #666;
  font-size: 300%;
  font-weight: bold;
`;

const CenteredParagraph = styled.p`
  text-align: center;
`;

interface IProps {
  onFileLoad?: () => void;
}

export function GCodeDropzone({ onFileLoad }: IProps) {
  const GCodeStore = useGCodeContext();

  const onDrop = useCallback(async acceptedFiles => {
    UIStore.setActiveGCode(null);
    const gcode = await uploadGCodeFiles(acceptedFiles);
    UIStore.setActiveGCode(gcode);
    GCodeStore.addGCode(gcode);
    if (onFileLoad) onFileLoad();
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <DropzoneContainer {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <CenteredParagraph>
          Drag a G-Code file here
          <br /> or <br /> click to select a file
        </CenteredParagraph>
      )}
    </DropzoneContainer>
  );
}
