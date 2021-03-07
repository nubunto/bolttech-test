import { IConfig } from "config";

export class Config {
  jwtSecret!: string;
  port!: number;

  constructor(config: IConfig) {
    this.jwtSecret = config.get("jwtSecret");
    this.port = config.get("port");
  }
}
