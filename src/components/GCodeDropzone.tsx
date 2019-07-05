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
import { useDropzone } from "react-dropzone";
import styled from "styled-components";
import { uploadGCodeFiles } from "app/file-upload";
import UIStore from "app/UIStore";

const DropzoneContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  margin: 10px;
  border-width: 4px;
  border-radius: 2px;
  border-color: #bbb;
  border-style: dashed;
  background-color: #fafafa;
  color: #333;
`;

interface IProps {
  onFileLoad: () => void;
}

export function GCodeDropzone({ onFileLoad }: IProps) {
  const onDrop = useCallback(async acceptedFiles => {
    UIStore.setActiveGCode(null);
    const gcode = await uploadGCodeFiles(acceptedFiles);
    UIStore.setActiveGCode(gcode);
    if (onFileLoad) onFileLoad();
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <DropzoneContainer {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </DropzoneContainer>
  );
}
