import type App from "./core/app";

declare global {
  interface TcfData extends Record<any, any> {
    eventStatus: string;
  }

  interface Window {
    gcmp: App;
    googlefc: {
      callbackQueue: any[];
      getAllowAdsStatus: () => number;
      showRevocationMessage: () => undefined;
    };
    __tcfapi: (
      command: any,
      version: any,
      callback: (...params: any) => void,
      ...param: any
    ) => void;
  }
}

export interface PurposeType {
  purpose: number;
  mode?: "hide" | "remove" | "disable";
  tags?: string[];
  selectors: string;
  cookies?: RegExp[];
  localStorage?: RegExp[];
  sessionStorage?: RegExp[];
  onRender?: (
    consent: boolean,
    nodes: NodeListOf<HTMLElement>,
    app: App,
  ) => undefined | boolean;
}

export type PurposesType = PurposeType[];

export interface EmbedOptionsType {
  svgBackground?: string;
  defaultHeight?: string;
  captionsTitle?: string;
  captionsSubtitle?: string;
}

export interface ElementOptionsType {
  mode?: "hide" | "remove" | "disable";
}

export interface ConfigType {
  debug?: boolean;
  tcfVersion?: number;
  waitForDom?: boolean;
  initWithGoogle?: boolean;
  root?: Document | Element;
  purposes?: PurposesType;
  embedOptions?: EmbedOptionsType;
  elementOptions?: ElementOptionsType;
  reloadAfterUserAction?: boolean;
  onInit: (app: App) => void;
  onUi: (app: App) => void;
  onLoad: (app: App) => void;
  onAdStatus?: (status: number) => void;
}

export type ConsentsType = Record<number, boolean>;
