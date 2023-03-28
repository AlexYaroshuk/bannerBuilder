abstract class Element {
  abstract addChild(child: Element): void;
  abstract removeChild(child: Element): void;
  abstract get isLeaf(): boolean;
}

class ElementContainer extends Element {
  containerName: string;
  isHovered: boolean;
  isSelected: boolean;
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
    this.type = "container";
    this.children = [];
    this.backgroundColor = "teal";
    this.borderColor = "transparent";
    this.borderRadius = 0;
    this.borderWidth = 0;
    this.BGImage = null;

  }

  addChild(child: Element): void {
    this.children.push(child);
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