import { ConfigType } from "../types";
import App from "../core/app";

export interface GcmpComponentProps {
  config: ConfigType;
}

export const GcmpComponent = (props: GcmpComponentProps): null => {
  const { config } = props;
  new App(config);
  return null;
};
