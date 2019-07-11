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

import {
  observable,
  action,
  computed,
  reaction,
  autorun,
  IReactionPublic
} from "mobx";
import OctoprintConnection from "./OctoprintConnection";

class OctoprintStore {
  constructor() {
    this.servers = this.restore("octoprint_servers", []).map((x: any) => ({
      config: x
    }));
    autorun(reaction => {
      this.servers = this.servers.map(({ config }) => ({
        config: config,
        connection: new OctoprintConnection(
          config.hostname,
          config.port,
          config.user,
          config.apikey
        )
      }));
    });
  }
  @observable
  servers: IOctoprintServer[] = [];

  @action
  addServer(server: IOctoprintConfig) {
    this.servers.push({ config: server, connection: null });
    this.save();
  }

  private save() {
    window.localStorage.setItem(
      "octoprint_servers",
      JSON.stringify(this.servers.map(x => x.config))
    );
  }
  private restore(key: string, defaultValue: any) {
    const savedValue = window.localStorage.getItem(key);
    return savedValue !== null ? JSON.parse(savedValue) : defaultValue;
  }
}

const store = new OctoprintStore();
export default store;

export interface IOctoprintServer {
  config: IOctoprintConfig;
  connection: OctoprintConnection | null;
}

export interface IOctoprintConfig {
  name: string;
  hostname: string;
  port: string;
  user: string;
  apikey: string;
}
