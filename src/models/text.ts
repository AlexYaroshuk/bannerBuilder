import { Container } from "./container";
import { Element } from "./element";
import { InvalidOperationError } from "./exceptions/invalidOperatorError";

class Text extends Element {

  get effectiveColor(): string | null {
    // Return this ElementText's color if it's defined, otherwise return its parent's color
    return this.color || (this.parentContainer && this.parentContainer.color) || null;
  }

  text: string;
  isSelected: boolean;
  isHovered: boolean;

  constructor({ name, text, color = 'black', backgroundColor = 'transparent', borderColor = 'transparent', parentContainer = null }
    : { name: string, text: string, backgroundColor?: string, color?: string, borderColor?: string, parentContainer?: Container | null }) {

    super({ name: name, backgroundColor: backgroundColor, color: color, borderColor: borderColor, parentContainer: parentContainer });

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

export { Text }