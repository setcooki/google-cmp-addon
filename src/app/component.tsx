import { ConfigType } from "../types";
import { app } from "../main";

export interface GcmpComponentProps {
  config: ConfigType;
}

export const GcmpComponent = (props: GcmpComponentProps): null => {
  const { config } = props;
  app(config);
  return null
};
