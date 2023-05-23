import { Element, State } from "./element";
import { Container } from "./container";
import { InvalidOperationError } from "./exceptions/invalidOperatorError";

interface VideoContent {
  value: string;
}

interface VideoState extends State {
  content: VideoContent;
}

class Video extends Element {
  readonly type: string;
  content: VideoContent;

  constructor({
    name,
    content,
    parentContainer = null,
    initialState = null,
  }: {
    name: string;
    content: VideoContent;
    parentContainer?: Container | null;
    initialState?: VideoState | null;
  }) {
    super({
      name: name,
      parentContainer: parentContainer,
      initialState: initialState,
    });

    this.type = "video";
    this.content = content;
    if (initialState) {
      (initialState as VideoState).content = content;
    } else {
      this.states.forEach((state) => {
        (state as VideoState).content = { ...content };
      });
    }
  }

  getContent(): VideoContent {
    return this.currentState.content as VideoContent;
  }

  setContent(content: VideoContent): void {
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

export { Video, VideoContent, VideoState };
