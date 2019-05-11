import { observable, action } from "mobx";

export default class OctoprintConnection {
  // http://sockjs.github.io/sockjs-protocol/sockjs-protocol-0.3.3.html#section-37
  private url: string;
  private socket: WebSocket;
  private domain: string;
  private port: string;

  @observable
  status: string = "";

  @observable
  progress: IProgress | null = null;

  constructor(domain: string, port: string) {
    const serverId = Math.floor(Math.random() * 999 + 1);
    const sessionId = this.generateSessionId();
    this.domain = domain;
    this.port = port;
    this.url = `ws://${domain}:${port}/sockjs/${serverId}/${sessionId}/websocket`;

    this.socket = new WebSocket(this.url);
    this.socket.onmessage = event => this.handleMessage(event);
  }

  public getCurrentFile() {
    if (this.progress && this.progress.path) {
      return fetch(
        `http://${this.domain}:${this.port}/downloads/files/local/${
          this.progress.path
        }`
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
        path: newJob.file.origin === "local" ? newJob.file.path : null,
      };
    } else this.progress = null;
  }

  private handleMessage(event: MessageEvent) {
    if (event.data.startsWith("a")) {
      var payload = JSON.parse(event.data.slice(1));
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
