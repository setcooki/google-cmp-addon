import type { ConfigType } from "./types";

const app = (config: ConfigType): void => {
  const debug = config.debug ?? false;
  const purposes = config.purposes ?? null;

  if(!purposes) {
    throw new Error("No purposes selected");
  }
};

export { app };
