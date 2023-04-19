import { Container } from "./container";
import { Element, HybridStyles } from "./element";
import { InvalidOperationError } from "./exceptions/invalidOperatorError";




class Image extends Element {
  url: string;
  readonly type: string;

  constructor({
    name,
    color = null,
    url,
    borderColor = "transparent",
    parentContainer = null,
  }: {
    name: string;
    url: string;
    borderColor?: string;
    color?: string | null;
    parentContainer?: Container | null;
  }) {
    super({
      name: name,
      color: color,
      borderColor: borderColor,
      parentContainer: parentContainer,

    });

    this.type = "image";

    this.url = url;

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

export { Image };
