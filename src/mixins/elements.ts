abstract class Element {
  color: string | null;
  parentContainer: ElementContainer | null;

  constructor() {
    this.color = null;
    this.parentContainer = null;
  }

  abstract addChild(child: Element): void;
  abstract removeChild(child: Element): void;
  abstract get isLeaf(): boolean;
}

class ElementContainer extends Element {
  containerName: string;
  isHovered: boolean;
  isSelected: boolean;
  isWidgetDropzonesShown: boolean;
  type: string;
  children: Element[];
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
    this.borderColor = "transparent";
    this.borderRadius = 0;
    this.borderWidth = 0;
    this.BGImage = null;

  }

  addChild(child: Element): void {
    this.children.push(child);
    child.parentContainer = this; // Set the parentContainer property of the child
  }

  removeChild(child: Element): void {
    const index = this.children.indexOf(child);
    if (index >= 0) {
      this.children.splice(index, 1);
    }
  }

  get isLeaf(): boolean {
    return false;
  }
}

class ElementText extends Element {

  get effectiveColor(): string | null {
    // Return this ElementText's color if it's defined, otherwise return its parent's color
    return this.color || (this.parentContainer && this.parentContainer.color) || null;
  }

  name: string;
  value: string;
  type: string;
  isSelected: boolean;
  isHovered: boolean;

  constructor(name: string, value: string) {
    super();
    this.name = name;
    this.value = value;
    this.type = "text";
    this.isSelected = false;
    this.isHovered = false;
  }



  addChild(child: Element): void {
    throw new InvalidOperationError("Cannot add a child to a leaf element.");
  }

  removeChild(child: Element): void {
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

export { Element, ElementContainer, ElementText, InvalidOperationError };