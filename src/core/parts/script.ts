import Part, { PartInterface } from "./part";

class Script extends Part implements PartInterface {
  constructor(element: HTMLElement) {
    super(element);
  }

  on() {
    const data: DOMStringMap = this.element.dataset;
    if ("type" in data && data.type) {
      this.element.setAttribute("type", data.type);
      delete this.element.dataset["type"];
    }
    if ("src" in data && data.src) {
      this.element.setAttribute("src", data.src);
      delete this.element.dataset["src"];
    }
  }

  off() {
    const attributes: NamedNodeMap = this.element.attributes;
    if (
      attributes.getNamedItem("type") &&
      attributes.getNamedItem("type")?.value
    ) {
      this.element.setAttribute(
        "data-type",
        attributes.getNamedItem("type")?.value as string,
      );
      this.element.setAttribute("type", "text/plain");
    }
    if (
      attributes.getNamedItem("src") &&
      attributes.getNamedItem("src")?.value
    ) {
      this.element.setAttribute(
        "data-src",
        attributes.getNamedItem("src")?.value as string,
      );
      this.element.removeAttribute("src");
    }
  }
}

export default Script;
