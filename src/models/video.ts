import { Container } from "./container";
import { Element, State, BackgroundLayer } from "./element";
import { InvalidOperationError } from "./exceptions/invalidOperatorError";

class Video extends Element {
  readonly type: string;

  value: string;

  constructor({
    name,
    value,
    parentContainer = null,
    initialState = null,
  }: {
    name: string;
    value: string;
    parentContainer?: Container | null;
    initialState?: State | null;
  }) {
    super({
      name: name,
      parentContainer: parentContainer,
      initialState: initialState,
    });

    this.type = "video";
    this.value = value;
  }

  getUrl(): string {
    return this.value;
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

export { Video };
