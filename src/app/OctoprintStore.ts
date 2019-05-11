import {
  observable,
  action,
  computed,
  reaction,
  autorun,
  IReactionPublic,
} from "mobx";
import OctoprintConnection from "./OctoprintConnection";

class OctoprintStore {
  constructor() {
    this.servers = this.restore("octoprint_servers", []).map((x: any) => ({
      config: x,
    }));
    autorun(reaction => {
      this.servers = this.servers.map(({ config }) => ({
        config: config,
        connection: new OctoprintConnection(config.hostname, config.port),
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
  apikey: string;
}
