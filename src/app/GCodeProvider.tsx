import * as React from "react";

import { createContext, useContext, useState } from "react";

import { IGCode } from "./UIStore";
import { produce } from "immer";

/*
export class GCodeContextValue {
  gcode: IGCode[] = [];

  addGCode = (gcode: IGCode) => {
    console.log("add", gcode);
    this.gcode = produce(this.gcode, (draft: IGCode[]) => {
      draft.push(gcode);
    });
    console.log(this.gcode);
  };

  removeGCode = (index: number) => {
    this.gcode = produce(this.gcode, (draft: IGCode[]) => {
      draft.splice(index, 1);
    });
  };
}

 const GCodeContextDefaults = new GCodeContextValue();
*/

interface IGCodeContext {
  gcodes: IGCode[];
  addGCode: (gcode: IGCode) => void;
}

export const GCodeContext = createContext<IGCodeContext | null>(null);

export const useGCodeContext = () => {
  const context = useContext(GCodeContext);
  if (context) return context;
  else throw new Error("Context is null");
};

export default ({ children }: { children: any }) => {
  const [gcodes, setGCodes] = useState<IGCode[]>([]);

  function addGCode(gcode: IGCode) {
    console.log("add", gcode);
    const newGcodes = produce(gcodes, (draft: IGCode[]) => {
      draft.push(gcode);
    });
    console.log(newGcodes);
    setGCodes(newGcodes);
  }

  return (
    <GCodeContext.Provider
      value={{
        gcodes: gcodes,
        addGCode: addGCode
      }}
    >
      {children}
    </GCodeContext.Provider>
  );
};
