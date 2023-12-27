import { type ConfigType } from "./types";
import { GcmpComponent } from "./app";
import { app } from "./main";

const init = (config: ConfigType): void => {
  app(config);
};

export { init, GcmpComponent };
