import { Element, State, BackgroundLayer } from "./element";

class Container extends Element {
  readonly type: string;
  isWidgetDropzonesShown: boolean;
  children: Element[];
  borderRadius: number;

  constructor({
    name,
    children = [],
    parentContainer = null,
    initialState = null,
  }: {
    name: string;
    children?: Element[];
    parentContainer?: Container | null;
    initialState?: State | null;
  }) {
    super({
      name: name,
      parentContainer: parentContainer,
      initialState: initialState,
    });

    this.type = "container";
    this.isWidgetDropzonesShown = false;
    this.borderRadius = 0;

    this.children = [];
    for (var child of children) {
      this.addChild(child);
    }
  }

  get isLeaf(): boolean {
    return this.children.length === 0;
  }

  // backgrounds

  getBackground(): BackgroundLayer[] | null {
    return this.currentState.style.background;
  }

  setBackground(background: BackgroundLayer[]): void {
    this.currentState.style.background = background;
  }

  addBackgroundLayer(layer: BackgroundLayer): void {
    this.currentState.style.background?.push(layer);
  }

  // * children

  getChildren(): Element[] {
    return this.children;
  }

  addChild(child: Element): void {
    child.parentContainer = this;
    this.children.push(child);
  }

  removeChild(child: Element): void {
    const index = this.children.indexOf(child);
    if (index >= 0) {
      this.children.splice(index, 1);
    }
  }

  swapChildren(childOne: Element, childTwo: Element): void {
    const fromId = this.children.indexOf(childOne);
    const toId = this.children.indexOf(childTwo);

    if (fromId >= 0 && toId >= 0) {
      [this.children[fromId], this.children[toId]] = [
        this.children[toId],
        this.children[fromId],
      ];
    }
  }
}

export { Container };
