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

import { observable, action } from "mobx";

export default class OctoprintConnection {
  // http://sockjs.github.io/sockjs-protocol/sockjs-protocol-0.3.3.html#section-37
  private url: string;
  private socket: WebSocket;
  private domain: string;
  private port: string;
  private apikey: string;

  @observable
  status: string = "";

  @observable
  progress: IProgress | null = null;

  constructor(domain: string, port: string, user: string, apikey: string) {
    const serverId = Math.floor(Math.random() * 999 + 1);
    const sessionId = this.generateSessionId();
    this.domain = domain;
    this.port = port;

    const protocol = window.location.protocol === "http:" ? 'ws:' : 'wss:';

    this.url = `${protocol}//${domain}:${port}/sockjs/${serverId}/${sessionId}/websocket`;
    this.apikey = apikey;

    console.log("Open websocket at " + this.url);
    this.socket = new WebSocket(this.url);
    this.socket.onmessage = event => this.handleMessage(event);
    this.socket.onopen = () => {
      this.socket.send(`["{\\"auth\\":\\"${user}:${apikey}\\"}"]`);
    };
  }

  public getCurrentFile() {
    if (this.progress && this.progress.path) {
      return fetch(
        `${window.location.protocol}//${this.domain}:${this.port}/downloads/files/local/${this.progress.path}`,
        {
          headers: {
            "X-Api-Key": this.apikey
          }
        }
      );
    } else return null;
  }

  private generateSessionId() {
    let sessionId = "";
    var chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 16; i++)
      sessionId += chars.charAt(Math.floor(Math.random() * chars.length));

    return sessionId;
  }

  @action
  private updateStatus(newStatus: string) {
    this.status = newStatus;
  }

  @action
  private updateProgress(newProgress: IProgress, newJob: any) {
    if (newProgress.filepos !== null) {
      this.progress = {
        completion: newProgress.completion,
        filepos: newProgress.filepos,
        filename: newJob.file.name,
        path: newJob.file.origin === "local" ? newJob.file.path : null
      };
    } else this.progress = null;
  }

  private handleMessage(event: MessageEvent) {
    // console.log("E", event.data);
    if (event.data.startsWith("a")) {
      var payload = JSON.parse(event.data.slice(1));
      //console.log(payload);
      if (payload.length === 1 && payload[0].current) {
        const data = payload[0].current;

        this.updateStatus(data.state.text);
        this.updateProgress(data.progress, data.job);
      }
    }
  }
}

interface IProgress {
  completion: number;
  filepos: number;
  filename: string;
  path: string | null;
}
