import { Element } from "./element";
import { InvalidOperationError } from "./exceptions/invalidOperatorError";

class ElementText extends Element {

  get effectiveColor(): string | null {
    // Return this ElementText's color if it's defined, otherwise return its parent's color
    return this.color || (this.parentContainer && this.parentContainer.color) || null;
  }

  name: string;
  text: string;
  isSelected: boolean;
  isHovered: boolean;

  constructor({ name, text }
    : { name: string, text: string }) {

    super({ name: name });

    this.name = name;
    this.text = text;
    this.isSelected = false;
    this.isHovered = false;
  }

  getText(): string {
    return this.text;
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