import { Container } from "./container";
import { Element, HybridStyles } from "./element";
import { InvalidOperationError } from "./exceptions/invalidOperatorError";




class Link extends Element {
  label: string;
  url: string;
  readonly type: string;
  isSelected: boolean;
  isHovered: boolean;

  constructor({
    name,
    label,
    url,
    color = null,
    fontSize,
    fontFamily,
    borderColor = "transparent",
    parentContainer = null,
  }: {
    name: string;
    label: string;
    url: string;
    fontSize?: number;
    fontFamily?: string;
    color?: string | null;
    borderColor?: string;
    parentContainer?: Container | null;
  }) {
    super({
      name: name,
      color: color,
      borderColor: borderColor,
      parentContainer: parentContainer,
      fontFamily: fontFamily,
      fontSize: fontSize,
    });

    this.type = "link";
    this.label = label;
    this.url = url;
    this.isSelected = false;
    this.isHovered = false;
  }

  getLabel(): string {
    return this.label;
  }

  getUrl(): string {
    return this.url;
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

export { Link };
