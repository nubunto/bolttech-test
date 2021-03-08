import express, { Request, Response, NextFunction } from "express";
import config from "config";
import winston from "winston";
import expressWinston from "express-winston";

import { installRoutes } from "./router";
import { services } from "./services";
import { Config } from "./config";

const logger = winston.createLogger({
  level: config.get("level") || "debug",
  transports: [new winston.transports.Console()],
  format: winston.format.simple(),
});
const app = express();
app.use(express.json());
app.use(
  expressWinston.logger({
    level: config.get("level") || "debug",
    transports: [new winston.transports.Console()],
    format: winston.format.simple(),
  })
);

const appConfig = new Config(config);
app.use("/api", installRoutes(services, appConfig));

app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
  if (err) {
    return res.status(404).json({
      error: err.message,
    });
  }
  next();
});

app.listen(config.get("port"), () => {
  logger.info(`Running application on port ${config.get("port")}`);
});
