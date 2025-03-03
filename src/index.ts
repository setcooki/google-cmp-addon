import { type ConfigType } from "./types";
import {
  GcmpComponent,
  GcmpProvider,
  useGcmpProvider,
  type GcmpComponentProps,
  type GcmpProviderProps,
} from "./app";
import App from "./core/app";

let app: App | undefined = undefined;

const init = (config: ConfigType): App => {
  app = new App(config);
  return app;
};

const refresh = (): void => {
  app?.refresh();
};

export {
  init,
  refresh,
  GcmpComponent,
  GcmpProvider,
  useGcmpProvider,
  type GcmpComponentProps,
  type GcmpProviderProps,
};
