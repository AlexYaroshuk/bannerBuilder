import { Container } from "./container";
import { Element, State, BackgroundLayer } from "./element";
import { InvalidOperationError } from "./exceptions/invalidOperatorError";

class Link extends Element {
  readonly type: string;
  label: string;
  url: string;

  constructor({
    name,
    label,
    url,
    parentContainer = null,
    initialState = null,
  }: {
    name: string;
    label: string;
    url: string;
    parentContainer?: Container | null;
    initialState?: State | null;
  }) {
    super({
      name: name,
      parentContainer: parentContainer,
      initialState: initialState,
    });

    this.type = "link";
    this.label = label;
    this.url = url;
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
    throw new InvalidOperationError(
      "Cannot remove a child from a leaf element."
    );
  }

  get isLeaf(): boolean {
    return true;
  }
}

export { Link };
