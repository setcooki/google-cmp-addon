import { type ConfigType } from "./types";
import { GcmpComponent } from "./app";
import App from "./core/app";

const init = (config: ConfigType): App => {
  const app = new App(config);
  return app;
};

export { init, GcmpComponent };
