import Part, { PartInterface } from "./part";

class Element extends Part implements PartInterface {
  constructor(element: HTMLElement) {
    super(element);
  }

  on() {
    if (this.element.classList.contains("gcmp-none")) {
      this.element.classList.remove("gcmp-none");
    }
  }

  off() {
    this.element.classList.add("gcmp-none");
  }
}

export default Element;
