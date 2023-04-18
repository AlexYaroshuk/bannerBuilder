import { Container } from "./container";
import { Element, HybridStyles } from "./element";
import { InvalidOperationError } from "./exceptions/invalidOperatorError";



class Text extends Element {


  getEffectiveStyles(): HybridStyles {
    return super.getEffectiveStyles();
  }


  text: string;
  readonly type: string;
  isSelected: boolean;
  isHovered: boolean;


  constructor({
    name,
    text,
    color = null,
    fontSize,
    fontFamily,
    borderColor = 'transparent',
    parentContainer = null
  }
    : {
      name: string,
      text: string,
      fontSize?: number,
      fontFamily?: string,
      color?: string | null;
      borderColor?: string,
      parentContainer?: Container | null
    }) {
    super({
      name: name,
      color: color,
      borderColor: borderColor,
      parentContainer: parentContainer,
      fontFamily: fontFamily,
      fontSize: fontSize
    });

    this.type = 'text';
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