import * as React from "react";
import { ConfigType } from "../types";

export interface GcmpContextType {
  config: ConfigType;
}

export interface GcmpProviderProps {
  children: React.ReactNode;
  config: ConfigType;
}

const GcmpContext = React.createContext<GcmpContextType | undefined>(undefined);

export const GcmpProvider = (props: GcmpProviderProps) => {
  const { children, config } = props;

  return (
    <GcmpContext.Provider value={{ config: config }}>
      {children}
    </GcmpContext.Provider>
  );
};

export const useGcmpProvider = (): GcmpContextType => {
  const context = React.useContext(GcmpContext);
  if (!context) {
    throw new Error("useGcmpProvider must be used within a GcmpProvider");
  }
  return context;
};
