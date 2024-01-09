import Part, { type PartInterface } from "./part";
import { ElementOptionsType } from "../../types";

class Element extends Part implements PartInterface {
  options: ElementOptionsType | undefined;
  constructor(element: HTMLElement, options: ElementOptionsType) {
    super(element);
    this.options = options;
  }

  on() {
    if (this.element.classList.contains("gcmp-none")) {
      this.element.classList.remove("gcmp-none");
    }
  }

  off() {
    if (this.options?.mode === "remove") {
      this.element.remove();
    } else {
      this.element.classList.add("gcmp-none");
    }
  }
}

export default Element;
