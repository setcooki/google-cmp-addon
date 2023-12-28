import { ConfigType, ConsentsType, PurposesType, PurposeType } from "../types";
import Script from "./parts/script";
import PartsElement from "./parts/element";

class App {
  debug: boolean;
  waitForDom: boolean;
  root: Document | Element;
  purposes: PurposesType | null;

  constructor(config: ConfigType) {
    this.debug = config.debug ?? false;
    this.waitForDom = config.waitForDom ?? true;
    this.root = config.root ?? document;
    this.purposes = config.purposes ?? null;
    this.init();
  }

  private init(): void {
    if (!this.purposes) {
      throw new Error("No purposes configured");
    }
    this.initGoogle();
    this.initCss();
    if (this.debug) {
      console.info("gcmp initialized");
    }
  }

  private initGoogle(): void {
    if (!("googlefc" in window) || ("googlefc" in window && !window.googlefc)) {
      throw new Error("Google consent api not found");
    }
  }

  private initCss(): void {
    const head = this.root.getElementsByTagName("head");
    if (head) {
      const css = `
        .gcmp-none {
          display: none;
          pointer-events: none;
          -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none;
          user-select: none;
        }
      `;
      const style = document.createElement("style");
      style.setAttribute("type", "text/css");
      style.appendChild(document.createTextNode(css));
      head[0].appendChild(style);
    }
  }

  render(consents: ConsentsType): void {
    const _render = (): void => {
      let purposes: { [key: number]: PurposeType } = {};
      this.purposes?.forEach((p: PurposeType): void => {
        purposes[p.id as number] = p;
      });
      Object.keys(consents).forEach((k: any): void => {
        let key = k as number;
        let value = consents[key] as boolean;
        if (key in purposes) {
          this.renderOnOff(purposes[key], value);
          this.renderCookies(purposes[key], value);
          this.renderStorage(purposes[key], value);
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
    const nodes: NodeListOf<HTMLElement> = this.root.querySelectorAll(
      purpose.selectors,
    );
    if (nodes.length) {
      nodes.forEach((element: HTMLElement) => {
        const name = element.nodeName.toLowerCase();

        switch (name) {
          case "script":
            new Script(element)[on ? "on" : "off"]();
            break;
          default:
            new PartsElement(element)[on ? "on" : "off"]();
        }
      });
    }
  }

  protected renderCookies(purpose: PurposeType, on: boolean): void {
    if (
      !on &&
      "cookies" in purpose &&
      purpose.cookies &&
      purpose.cookies.length
    ) {
      const cookies: string[] = document.cookie.split(";");
      if (cookies.length) {
        cookies.forEach((cookie: string) => {
          let name = cookie.trim().split("=")[0];
          purpose.cookies?.forEach((rule: RegExp) => {
            if (rule.test(name)) {
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
        purpose.localStorage &&
        purpose.localStorage.length &&
        window.localStorage
      ) {
        const items: { [key: string]: any } = { ...window.localStorage };
        for (const [key, value] of Object.entries(items)) {
          purpose.localStorage?.forEach((rule: RegExp) => {
            if (rule.test(key)) {
              window.localStorage.removeItem(key);
            }
          });
        }
      }
      if (
        "sessionStorage" in purpose &&
        purpose.sessionStorage &&
        purpose.sessionStorage.length &&
        window.sessionStorage
      ) {
        const items: { [key: string]: any } = { ...window.sessionStorage };
        for (const [key, value] of Object.entries(items)) {
          purpose.sessionStorage?.forEach((rule: RegExp) => {
            if (rule.test(key)) {
              window.sessionStorage.removeItem(key);
            }
          });
        }
      }
    }
  }
}

export default App;
