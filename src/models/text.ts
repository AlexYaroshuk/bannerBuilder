import { Container } from "./container";
import { Element, State, BackgroundLayer } from "./element";
import { InvalidOperationError } from "./exceptions/invalidOperatorError";

class Text extends Element {
  readonly type: string;
  text: string;

  constructor({
    name,
    text,
    parentContainer = null,
    initialState = null,
  }: {
    name: string;
    text: string;
    parentContainer?: Container | null;
    initialState?: State | null;
  }) {
    super({
      name: name,
      parentContainer: parentContainer,
      initialState: initialState,
    });

    this.type = "text";
    this.text = text;
  }

  getText(): string {
    return this.text;
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

export { Text };
