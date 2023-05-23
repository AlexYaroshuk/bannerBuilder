import { Element, State } from "./element";
import { Container } from "./container";
import { InvalidOperationError } from "./exceptions/invalidOperatorError";

interface ImageContent {
  value: string;
}

interface ImageState extends State {
  content: ImageContent;
}

class Image extends Element {
  readonly type: string;
  content: ImageContent;

  constructor({
    name,
    content,
    parentContainer = null,
    initialState = null,
  }: {
    name: string;
    content: ImageContent;
    parentContainer?: Container | null;
    initialState?: ImageState | null;
  }) {
    super({
      name: name,
      parentContainer: parentContainer,
      initialState: initialState,
    });

    this.type = "image";
    this.content = content;
    if (initialState) {
      (initialState as ImageState).content = content;
    } else {
      this.states.forEach((state) => {
        (state as ImageState).content = { ...content };
      });
    }
  }

  getContent(): ImageContent {
    return this.currentState.content as ImageContent;
  }

  setContent(content: ImageContent): void {
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

export { Image, ImageContent, ImageState };
