import Part, { type PartInterface } from "./part";

class Script extends Part implements PartInterface {
  constructor(element: HTMLElement) {
    super(element);
  }

  on() {
    const data: DOMStringMap = this.element.dataset;
    const element: HTMLElement = document.createElement(this.element.tagName);
    const parent: HTMLElement | null = this.element.parentElement;
    for (const attribute of this.element.attributes) {
      element.setAttribute(attribute.name, attribute.value);
    }
    element.innerText = this.element.innerText;
    if ("type" in data && data.type) {
      element.setAttribute("type", data.type);
    }
    if ("src" in data && data.src) {
      element.setAttribute("src", data.src);
    }
    if (parent) {
      parent.insertBefore(element, this.element);
      parent.removeChild(this.element);
    }
  }

  off() {
    const attributes: NamedNodeMap = this.element.attributes;
    if (attributes.getNamedItem("type")?.value) {
      this.element.setAttribute(
        "data-type",
        attributes.getNamedItem("type")?.value as string,
      );
      this.element.setAttribute("type", "text/plain");
    }
    if (attributes.getNamedItem("src")?.value) {
      this.element.setAttribute(
        "data-src",
        attributes.getNamedItem("src")?.value as string,
      );
      this.element.removeAttribute("src");
    }
  }
}

export default Script;
