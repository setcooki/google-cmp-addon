import App from "./core/app";

declare global {
  interface Window {
    gcmp: App;
  }
}

export type PurposeType = {
  id: number;
  selectors: string;
  cookies?: RegExp[];
  localStorage?: RegExp[];
  sessionStorage?: RegExp[];
};

export type PurposesType = PurposeType[];

export type ConfigType = {
  debug?: boolean;
  waitForDom?: boolean;
  root?: Document | Element;
  purposes?: PurposesType;
};

export type ConsentsType = { [key: number]: boolean };
