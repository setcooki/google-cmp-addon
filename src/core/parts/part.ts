export interface PartInterface {
  on: () => void;
  off: () => void;
}

abstract class Part {
  protected element: HTMLElement;
  protected constructor(element: HTMLElement) {
    this.element = element;
  }
}

export default Part;
