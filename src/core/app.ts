import {
  type ConfigType,
  type ConsentsType,
  ElementOptionsType,
  type EmbedOptionsType,
  type PurposesType,
  type PurposeType,
} from "../types";
import Script from "./parts/script";
import PartsElement from "./parts/element";
import Iframe from "./parts/iframe";
import Placeholder from "../utils/placeholder";

class App {
  initialized: boolean;
  debug: boolean;
  tcfVersion: number;
  waitForDom: boolean | undefined;
  initWithGoogle: boolean;
  root: Document | Element;
  purposes: PurposesType | null;
  embedOptions: EmbedOptionsType | undefined;
  elementOptions: ElementOptionsType | undefined;
  reloadAfterUserAction: boolean;
  onInit: ((app: App) => void) | undefined;
  onUi: ((app: App) => void) | undefined;
  onLoad: ((app: App) => void) | undefined;
  onAdStatus: ((status: number) => void) | undefined;
  protected tcfStatus: string;
  protected tcfData?: TcfData;
  protected waitForGfcTimeout: null | ReturnType<typeof setTimeout> =
    setTimeout(() => {});

  private readonly waitForGfcInitTs: number;

  constructor(config: ConfigType) {
    this.initialized = false;
    this.tcfVersion = config.tcfVersion ?? 2.2;
    this.debug = config.debug ?? false;
    this.waitForDom = config.waitForDom ?? undefined;
    this.initWithGoogle = config.initWithGoogle ?? true;
    this.root = config.root ?? document;
    this.purposes = config.purposes ?? null;
    this.embedOptions = config.embedOptions ?? {
      defaultHeight: "240px",
      captionsTitle: "Please accept the terms for embedded content",
    };
    this.elementOptions = config.elementOptions ?? {};
    this.waitForGfcInitTs = Date.now();
    this.waitForGfcTimeout = null;
    this.reloadAfterUserAction = config.reloadAfterUserAction ?? false;
    this.onInit = config.onInit ?? undefined;
    this.onUi = config.onUi ?? undefined;
    this.onLoad = config.onLoad ?? undefined;
    this.onAdStatus = config.onAdStatus ?? undefined;
    this.tcfStatus = "";
    if (!this.initWithGoogle && this.waitForDom === undefined) {
      this.waitForDom = true;
    }
    if (this.debug) {
      console.info("gcmp init with config", config);
    }
    this.init();
  }

  private init(): void {
    if (this.debug) {
      console.info("gcmp initializing");
    }
    if (!this.purposes) {
      console.error("No purposes configured");
    }
    if (this.initWithGoogle) {
      this.initGoogle();
    } else {
      if (this.onInit && typeof this.onInit === "function") {
        this.onInit(this);
      }
      if (this.onLoad && typeof this.onLoad === "function") {
        this.onLoad(this);
      }
      if (this.onUi && typeof this.onUi === "function") {
        this.onUi(this);
      }
    }
    this.initCss();
    this.initialized = true;
    if (this.debug) {
      console.info("gcmp initialized");
    }
  }

  public refresh(): void {
    const data = this?.tcfData;
    if (this.debug) {
      console.info("gcmp refresh");
    }
    if (
      data &&
      "purpose" in data &&
      data.purpose &&
      typeof data.purpose === "object"
    ) {
      if (
        "consents" in data.purpose &&
        data.purpose.consents &&
        typeof data.purpose.consents === "object"
      ) {
        if (this.debug) {
          console.info("gcmp refresh consents", data.purpose.consents);
        }
        this.render(data.purpose.consents as ConsentsType);
      }
    }
  }

  private waitForGfc(callback: () => void): void {
    const elapsedTime = Date.now() - this.waitForGfcInitTs;

    if (elapsedTime >= 3000) {
      if (this.waitForGfcTimeout) {
        clearTimeout(this.waitForGfcTimeout);
      }
      this.waitForGfcTimeout = null;
      if (this.debug) {
        console.error("Google consent API not found (timed out)");
      }
      return;
    }

    if ("googlefc" in window && window.googlefc) {
      this.waitForGfcTimeout = null;
      callback();
    } else {
      this.waitForGfcTimeout = setTimeout(() => {
        this.waitForGfc(callback);
      }, 10);
    }
  }

  protected initGoogle(): void {
    const observer = new MutationObserver((mutations, obs) => {
      const dialog = document.getElementsByClassName("fc-choice-dialog");
      if (dialog.length) {
        if (this.onUi && typeof this.onUi === "function") {
          this.onUi(this);
        }
        obs.disconnect();
        return;
      }
    });
    observer.observe(document, {
      childList: true,
      subtree: true,
    });
    this.waitForGfc(() => {
      window.googlefc.callbackQueue.push({
        CONSENT_DATA_READY: () => {
          window.googlefc.callbackQueue.push({
            AD_BLOCK_DATA_READY: () => {
              if (this.debug) {
                console.info("gcmp ad block data ready callback");
              }
              if (this.onAdStatus) {
                this.onAdStatus(window.googlefc.getAllowAdsStatus());
              }
            },
          });
          if (this.debug) {
            console.info("gcmp consent data ready callback");
          }
          if ("__tcfapi" in window && window.__tcfapi) {
            window.__tcfapi(
              "addEventListener",
              this.tcfVersion,
              (data: TcfData) => {
                this.tcfData = data;
                if (this.debug) {
                  console.info("gcmp tcfapi ready callback", data);
                }
                this.tcfStatus = data?.eventStatus;
                if (
                  this.tcfStatus === "tcloaded" &&
                  this.onLoad &&
                  typeof this.onLoad === "function"
                ) {
                  this.onLoad(this);
                }
                if (this.onInit && typeof this.onInit === "function") {
                  this.onInit(this);
                }
                if (
                  this.reloadAfterUserAction &&
                  data?.eventStatus === "useractioncomplete"
                ) {
                  window.location.reload();
                }
                if (
                  "purpose" in data &&
                  data.purpose &&
                  typeof data.purpose === "object"
                ) {
                  if (
                    "consents" in data.purpose &&
                    data.purpose.consents &&
                    typeof data.purpose.consents === "object"
                  ) {
                    if (this.debug) {
                      console.info(
                        "gcmp tcfapi render consent",
                        data.purpose.consents,
                      );
                    }
                    this.render(data.purpose.consents as ConsentsType);
                  }
                }
              },
            );
          }
        },
      });
    });
  }

  protected initCss(): void {
    const head = this.root.getElementsByTagName("head");
    const placeholder = this.embedOptions?.svgBackground
      ? this.embedOptions?.svgBackground
      : Placeholder();
    if (head) {
      const css = `
        .gcmp-none {
          display: none;
          pointer-events: none;
          -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none;
          user-select: none;
        }
        .gcmp-embed {
          position: relative;
          display: block;
          overflow: hidden;
          max-width: 100%;
          min-width: 240px;
          min-height: ${this.embedOptions?.defaultHeight || "inherit"};
          height: inherit;
          padding-bottom: inherit;
          background-image: url("data:image/svg+xml;base64, ${btoa(
            placeholder,
          )}");
          background-color: transparent;
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center center;
        }
        .gcmp-embed-placeholder {
          top: 50%;
          left: 0;
          position: absolute;
          width: 100%;
          text-align: center;
          transform: translateY(-50%);
          background: hsla(0, 0%, 0%, 0.8);
          color: #fff;
          font-size: 13px;
          padding: 10px;
        }
        .gcmp-embed-caption {
          overflow-wrap: break-word;
          word-wrap: break-word;
          -ms-word-break: break-all;
          word-break: break-all;
          word-break: break-word;
          -ms-hyphens: auto;
          -moz-hyphens: auto;
          -webkit-hyphens: auto;
          hyphens: auto;
        }
      `;
      const style = document.createElement("style");
      style.setAttribute("type", "text/css");
      style.appendChild(document.createTextNode(css));
      head[0].appendChild(style);
    }
  }

  revoke(): void {
    if (this.initialized) {
      window.googlefc.callbackQueue.push({
        CONSENT_DATA_READY: () => {
          window.googlefc.showRevocationMessage();
        },
      });
    } else {
      if (this.debug) {
        console.error("gcmp not initialized");
      }
    }
  }

  render(consents: ConsentsType): void {
    const _render = (): void => {
      const purposes: Record<number, PurposeType[]> = {};
      this.purposes?.forEach((p: PurposeType): void => {
        if (!(p.purpose in purposes)) {
          purposes[p.purpose] = [];
        }
        purposes[p.purpose].push(p);
      });
      Object.keys(consents).forEach((k: any): void => {
        const key = k as number;
        const consent = consents[key] as boolean;
        if (key in purposes) {
          if (this.debug) {
            console.info(
              `gcmp rendering purpose: ${key} with consent: ${consent}`,
            );
          }
          purposes[key].forEach((p: PurposeType) => {
            if (this.debug) {
              console.info(`gcmp rendering object`, p);
            }
            if (p.onRender && typeof p.onRender === "function") {
              const result = p.onRender(
                consent,
                this.root.querySelectorAll(p.selectors),
                this,
              );
              if (result === false) {
                return;
              }
            }
            this.renderOnOff(p, consent);
            this.renderCookies(p, consent);
            this.renderStorage(p, consent);
          });
        }
      });
    };
    if (this.waitForDom) {
      document.addEventListener(
        "DOMContentLoaded",
        function () {
          _render();
        },
        false,
      );
    } else {
      _render();
    }
  }

  protected renderOnOff(purpose: PurposeType, on: boolean): void {
    let elementOptions = this.elementOptions ?? {};
    const tags: string[] = purpose.tags ?? [];
    const mode: string | undefined = purpose.mode ?? undefined;
    try {
      const nodes: NodeListOf<HTMLElement> = this.root.querySelectorAll(
        purpose.selectors,
      );
      if (this.debug) {
        console.info(
          `gcmp found the following nodes to render for purpose: ${purpose.purpose} (${purpose.selectors})`,
          nodes,
        );
      }
      if (nodes.length) {
        nodes.forEach((element: HTMLElement): void | null => {
          const name = element.nodeName.toLowerCase();
          if (this.debug) {
            console.info(
              `gcmp rendering: ${name} for purpose: ${purpose.purpose} (${purpose.selectors}) to: ${on}`,
            );
          }
          if (tags.length && !tags.includes(name)) {
            if (this.debug) {
              console.warn(
                `gcmp skipping: ${name} for purpose: ${purpose.purpose} (${purpose.selectors}) since its not in provided tag list`,
              );
            }
            return null;
          }
          switch (name) {
            case "script":
              new Script(element)[on ? "on" : "off"]();
              break;
            case "iframe":
              new Iframe(element, this.embedOptions)[on ? "on" : "off"]();
              break;
            default:
              if (this.debug) {
                console.warn(
                  `gcmp tag: ${name} is not defined and falls back to default element`,
                );
              }
              if (mode) {
                elementOptions = {
                  ...elementOptions,
                  ...({ mode: mode } as ElementOptionsType),
                };
              }
              new PartsElement(element, elementOptions)[on ? "on" : "off"]();
          }
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e: any) {
      if (this.debug) {
        console.warn(`gcmp purpose: ${purpose.purpose} has illegal selectors`);
      }
    }
  }

  protected renderCookies(purpose: PurposeType, on: boolean): void {
    if (!on && "cookies" in purpose && purpose.cookies?.length) {
      const cookies: string[] = document.cookie.split(";");
      if (cookies.length > 0) {
        cookies.forEach((cookie: string) => {
          const name = cookie.trim().split("=")[0];
          purpose.cookies?.forEach((rule: RegExp) => {
            if (rule.test(name)) {
              if (this.debug) {
                console.info(
                  `gcmp remove cookies: ${name} for purpose: ${purpose.purpose}`,
                );
              }
              document.cookie =
                name + "=; Path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            }
          });
        });
      }
    }
  }

  protected renderStorage(purpose: PurposeType, on: boolean): void {
    if (!on) {
      if (
        "localStorage" in purpose &&
        purpose.localStorage?.length &&
        window.localStorage
      ) {
        const items: Record<string, any> = { ...window.localStorage };
        for (const [key, value] of Object.entries(items)) {
          purpose.localStorage?.forEach((rule: RegExp) => {
            if (rule.test(key)) {
              if (this.debug) {
                console.info(
                  `gcmp remove from local storage: ${key}: ${value} for purpose: ${purpose.purpose}`,
                );
              }
              window.localStorage.removeItem(key);
            }
          });
        }
      }
      if (
        "sessionStorage" in purpose &&
        purpose.sessionStorage?.length &&
        window.sessionStorage
      ) {
        const items: Record<string, any> = { ...window.sessionStorage };
        for (const [key, value] of Object.entries(items)) {
          purpose.sessionStorage?.forEach((rule: RegExp) => {
            if (rule.test(key)) {
              if (this.debug) {
                console.info(
                  `gcmp remove from session storage: ${key}: ${value} for purpose: ${purpose.purpose}`,
                );
              }
              window.sessionStorage.removeItem(key);
            }
          });
        }
      }
    }
  }
}

export default App;
