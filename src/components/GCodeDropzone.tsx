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

export function GCodeDropzone() {
  const onDrop = useCallback(async acceptedFiles => {
    // Do something with the files
    console.log(acceptedFiles);
    const gcode = await uploadGCodeFiles(acceptedFiles);
    console.log("FINISHED", gcode);
    UIStore.setActiveGCode(gcode);
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
