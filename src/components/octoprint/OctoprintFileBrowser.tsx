import * as React from "react";
import { observer } from "mobx-react-lite";
import { IOctoprintConfig } from "app/OctoprintStore";
import { Machine, assign } from "xstate";
import { useMachine } from "@xstate/react";

interface IProps {
  config: IOctoprintConfig;
}

interface FileBrowserSchema {
  states: {
    loading: {};
    loaded: {};
    error: {};
  };
}

type FileBrowserEvent = { type: "TOGGLE" } | { type: "RETRY" };

interface FileBrowserContext {
  config: IOctoprintConfig;
  error?: any;
}

const fileBrowserMachine = (context:any) =>
  //Machine<FileBrowserContext, FileBrowserSchema, FileBrowserEvent>(
    Machine(
    {
      id: "file_browser",
      initial: "loading",
      states: {
        loading: {
          invoke: {
            id: "load files",
            src: (context: FileBrowserContext, event:any) =>
              listFiles(context.config),
            onDone: {
              target: "loaded"
            },
            onError: {
              target: "error",
              actions: assign({ error: (context:any, event:any) => event.data })
            }
          }
        },
        loaded: { on: { TOGGLE: "inactive" } },
        error: {
          on: { RETRY: "loading" }
        }
      }
    },
    undefined,
    context
  );

function listFiles(config: IOctoprintConfig) {
  return fetch(`https://${config.hostname}:${config.port}/api/files`, {
    headers: {
      "X-Api-Key": config.apikey
    }
  });
}

const OctoprintFileBrowser = observer(({ config }: IProps) => {
  const [currentState, send] = useMachine(
    fileBrowserMachine({ config: config })
  );
  return <div>Bla{currentState.matches("error") && <p>Error</p>}</div>;
});
export default OctoprintFileBrowser;
