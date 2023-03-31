import { Element } from "./element";
import { InvalidOperationError } from "./exceptions/invalidOperatorError";

class ElementText extends Element {

  get effectiveColor(): string | null {
    // Return this ElementText's color if it's defined, otherwise return its parent's color
    return this.color || (this.parentContainer && this.parentContainer.color) || null;
  }

  name: string;
  value: string;
  type: string;
  isSelected: boolean;
  isHovered: boolean;

  constructor(name: string, value: string) {
    super();
    this.name = name;
    this.value = value;
    this.type = "text";
    this.isSelected = false;
    this.isHovered = false;
  }



  addChild(child: Element): void {
    throw new InvalidOperationError("Cannot add a child to a leaf element.");
  }

  removeChild(child: Element): void {
    throw new InvalidOperationError("Cannot remove a child from a leaf element.");
  }

  get isLeaf(): boolean {
    return true;
  }
}

export { ElementText }