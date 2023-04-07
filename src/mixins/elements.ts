interface Typography {
  color: string | null;
  fontFamily: string | null;
  fontWeight: number | null;
  fontSize: number | null;
}

abstract class CustomElement implements Typography {
  color: string | null;
  fontFamily: string | null;
  fontWeight: number | null;
  fontSize: number | null;
  parentContainer: ElementContainer | null;
  isSelected: boolean;
  isHovered: boolean;

  constructor() {
    this.color = null;
    this.fontFamily = null;
    this.fontWeight = null;
    this.fontSize = null;
    this.parentContainer = null;
    this.isSelected = false;
    this.isHovered = false;
  }

  abstract addChild(child: CustomElement): void;
  abstract removeChild(child: CustomElement): void;
  abstract get isLeaf(): boolean;
  abstract readonly type: string;

  getEffectiveStyles(): Typography {
    const parent = this.parentContainer;
    return {
      color: this.color || (parent && parent.color) || null,
      fontFamily: this.fontFamily || (parent && parent.fontFamily) || null,
      fontWeight: this.fontWeight || (parent && parent.fontWeight) || null,
      fontSize: this.fontSize || (parent && parent.fontSize) || null,
    };
  }
}

class ElementContainer extends CustomElement {
  name: string;
  readonly type: string;
  children: CustomElement[];
  backgroundColor: string;
  borderColor: string;
  borderRadius: number;
  borderWidth: number;
  BGImage: string | null;

  constructor(name: string) {
    super();
    this.name = name;
    this.type = "container";
    this.children = [];
    this.backgroundColor = "teal";
    this.color = "black";
    this.fontFamily = "Arial, sans-serif";
    this.fontWeight = 400;
    this.fontSize = 16;
    this.borderColor = "transparent";
    this.borderRadius = 0;
    this.borderWidth = 0;
    this.BGImage = null;
  }

  addChild(child: CustomElement): void {
    this.children.push(child);
    child.parentContainer = this;
  }

  removeChild(child: CustomElement): void {
    const index = this.children.indexOf(child);
    if (index >= 0) {
      this.children.splice(index, 1);
    }
  }

  get isLeaf(): boolean {
    return false;
  }
}

class ElementText extends CustomElement {
  name: string;
  value: string;
  readonly type: string;

  constructor(name: string = "New Text Element", value: string = "New text") {
    super();
    this.name = name;
    this.value = value;
    this.type = "text";
  }

  addChild(child: CustomElement): void {
    throw new InvalidOperationError("Cannot add a child to a leaf element.");
  }

  removeChild(child: CustomElement): void {
    throw new InvalidOperationError("Cannot remove a child from a leaf element.");
  }

  get isLeaf(): boolean {
    return true;
  }
}

class ElementLink extends CustomElement {
  name: string;
  value: string;
  readonly type: string;
  color: string;
  hover: string;
  visited: string;
  visitedHover: string;
  URL: string;

  constructor(name: string = "New Link Element", value: string = "New link", URL: string = "https://example.com") {
    super();
    this.name = name;
    this.value = value;
    this.type = "link";
    this.color = "blue";
    this.hover = "";
    this.visited = "";
    this.visitedHover = "";
    this.URL = URL;
  }

  addChild(child: CustomElement): void {
    throw new InvalidOperationError("Cannot add a child to a leaf element.");
  }

  removeChild(child: CustomElement): void {
    throw new InvalidOperationError("Cannot remove a child from a leaf element.");
  }

  get isLeaf(): boolean {
    return true;
  }
}

class InvalidOperationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidOperationError";
  }
}

export { CustomElement, ElementContainer, ElementText, ElementLink, InvalidOperationError };
