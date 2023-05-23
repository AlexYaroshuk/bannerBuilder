import { Element, State } from "./element";
import { Container } from "./container";
import { InvalidOperationError } from "./exceptions/invalidOperatorError";

interface TextContent {
  text: string;
}

interface TextState extends State {
  content: TextContent;
}

class Text extends Element {
  readonly type: string;
  content: TextContent;

  constructor({
    name,
    content,
    parentContainer = null,
    initialState = null,
  }: {
    name: string;
    content: TextContent;
    parentContainer?: Container | null;
    initialState?: TextState | null;
  }) {
    super({
      name: name,
      parentContainer: parentContainer,
      initialState: initialState,
    });

    this.type = "text";
    this.content = content;
    if (initialState) {
      (initialState as TextState).content = content;
    } else {
      this.states.forEach((state) => {
        (state as TextState).content = { ...content };
      });
    }
  }

  getContent(): TextContent {
    return this.currentState.content as TextContent;
  }

  setContent(content: TextContent): void {
    this.currentState.content = content;
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

export { Text, TextContent, TextState };
