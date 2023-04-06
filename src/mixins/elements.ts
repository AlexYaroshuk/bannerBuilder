abstract class CustomElement {
  color: string | null;
  fontFamily: string | null;
  fontWeight: number | null;
  fontSize: number | null;
  parentContainer: ElementContainer | null;

  constructor() {
    this.color = null;
    this.fontFamily = null;
    this.fontWeight = null;
    this.fontSize = null;
    this.parentContainer = null;
  }

  abstract addChild(child: CustomElement): void;
  abstract removeChild(child: CustomElement): void;
  abstract get isLeaf(): boolean;
}

class ElementContainer extends CustomElement {
  containerName: string;
  isHovered: boolean;
  isSelected: boolean;
  isWidgetDropzonesShown: boolean;
  type: string;
  children: CustomElement[];
  backgroundColor: string;
  borderColor: string;
  borderRadius: number;
  borderWidth: number;
  BGImage: string | null;


  constructor(containerName: string) {
    super();
    this.containerName = containerName;
    this.isHovered = false;
    this.isSelected = false;
    this.isWidgetDropzonesShown = false;
    this.type = "container";
    this.children = [];
    this.backgroundColor = "teal";
    this.color = "black"
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

abstract class ElementLeaf extends CustomElement {
  name: string;
  value: string;
  type: string;
  isSelected: boolean;
  isHovered: boolean;

  constructor(type: string, name: string = "New Leaf Element", value: string = "New value") {
    super();
    this.name = name;
    this.value = value;
    this.type = type;
    this.isSelected = false;
    this.isHovered = false;
  }

  get effectiveStyles() {
    const parent = this.parentContainer;
    return {
      color: this.color || (parent && parent.color) || null,
      fontFamily: this.fontFamily || (parent && parent.fontFamily) || null,
      fontWeight: this.fontWeight || (parent && parent.fontWeight) || null,
      fontSize: this.fontSize || (parent && parent.fontSize) || null,
    };
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

class ElementText extends ElementLeaf {
  constructor(name: string = "New Text Element", value: string = "New text") {
    super("text", name, value);
  }

  /*   get effectiveColor(): string | null {
      // Return this ElementText's color if it's defined, otherwise return its parent's color
      return this.color || (this.parentContainer && this.parentContainer.color) || null;
    } */
}

class ElementLink extends ElementLeaf {
  hover: string;
  visited: string;
  visitedHover: string;
  URL: string;

  constructor(name: string = "New Link Element", value: string = "New link", URL: string = "https://example.com") {
    super("link", name, value);
    this.color = "blue";
    this.hover = "";
    this.visited = "";
    this.visitedHover = "";
    this.URL = URL;
  }
}

class InvalidOperationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidOperationError";
  }
}

export { CustomElement, ElementContainer, ElementText, ElementLink, ElementLeaf, InvalidOperationError };