import Part, { type PartInterface } from "./part";
import { type EmbedOptionsType } from "../../types";

class Iframe extends Part implements PartInterface {
  options: EmbedOptionsType | undefined;

  constructor(element: HTMLElement, options: EmbedOptionsType | undefined) {
    super(element);
    this.options = options ?? undefined;
  }

  on() {}

  off() {
    const container = document.createElement("div");
    const placeholder = document.createElement("div");
    const caption = document.createElement("div");
    const script = document.createElement("script");
    script.setAttribute("type", "text/plain");
    script.innerText = btoa(this.element.outerHTML);
    container.setAttribute("data-embed", "");
    container.classList.add("gcmp-embed");
    placeholder.classList.add("gcmp-embed-placeholder");
    caption.classList.add("gcmp-embed-caption");
    caption.innerText = this.options?.captionsTitle ?? "";
    placeholder.appendChild(caption);
    container.appendChild(placeholder);
    container.appendChild(script);
    this.element.parentNode?.replaceChild(container, this.element);
  }
}

export default Iframe;
