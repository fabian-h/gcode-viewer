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

import * as React from "react";

import { Machine, assign, interpret } from "xstate";

import { IOctoprintConfig } from "app/OctoprintStore";
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
  files: string[];
  error: any;
}

const fileBrowserMachine = (context: any) =>
  Machine<FileBrowserContext, FileBrowserSchema, FileBrowserEvent>(
    //Machine(
    {
      id: "file_browser",
      initial: "loading",
      states: {
        loading: {
          invoke: {
            id: "load files",
            src: (context: FileBrowserContext, event: any) =>
              listFiles(context.config),
            onDone: {
              target: "loaded",
              actions: ["updateFiles"]
            },
            onError: {
              target: "error",
              actions: ["error"]
            }
          }
        },
        loaded: { on: { TOGGLE: "inactive" } },
        error: {
          on: { RETRY: "loading" }
        }
      }
    },
    {
      actions: {
        error: assign({ error: (context: any, event: any) => "error" }),
        updateFiles: assign({
          files: (context: any, event: any) => {
            return event.data.files;
          }
        })
      }
    }
  ).withContext(context);

async function listFiles(config: IOctoprintConfig) {
  var response = await fetch(
    `${window.location.protocol}//${config.hostname}:${config.port}/api/files`,
    {
      headers: {
        "X-Api-Key": config.apikey
      }
    }
  );
  return response.json();
}

const OctoprintFileBrowser = ({ config }: IProps) => {
  const machine = fileBrowserMachine({ config: config, files: [] });
  const [currentState, send] = useMachine(machine);
  const service = interpret(machine, { devTools: true }).onTransition(state => {
    //console.log(state.value, machine.context);
  });
  service.start();

  return (
    <>
      <div>
        {currentState.matches("error") && <p>Error</p>}
        {currentState.matches("loaded") && (
          <ul>
            {currentState.context.files.map((file: any) => (
              <li>{file.name}</li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};
export default OctoprintFileBrowser;
