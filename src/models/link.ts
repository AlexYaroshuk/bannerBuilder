import { Container } from "./container";
import { Element, State, BackgroundLayer } from "./element";
import { InvalidOperationError } from "./exceptions/invalidOperatorError";

interface LinkContent {
  label: string;
  url: string;
}

interface LinkState extends State {
  content: LinkContent;
}

class Link extends Element {
  readonly type: string;
  content: LinkContent;

  constructor({
    name,
    content,
    parentContainer = null,
    initialState = null,
  }: {
    name: string;
    content: LinkContent;
    parentContainer?: Container | null;
    initialState?: LinkState | null;
  }) {
    super({
      name: name,
      parentContainer: parentContainer,
      initialState: initialState,
    });

    this.type = "link";
    this.content = content;

    if (initialState) {
      (initialState as LinkState).content = content;
    } else {
      this.states.forEach((state) => {
        (state as LinkState).content = { ...content };
      });
    }
  }

  getContent(): LinkContent {
    return this.currentState.content as LinkContent;
  }

  setContent(content: LinkContent): void {
    this.currentState.content = content;
  }

  getLabel(): string {
    return this.content.label;
  }

  setLabel(label: string): void {
    this.content.label = label;
  }

  getUrl(): string {
    return this.content.url;
  }

  setUrl(url: string): void {
    this.content.url = url;
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

export { Link, LinkContent, LinkState };
