import { Container } from "@/models/container";

abstract class Element {
  name: string
  color: string;
  backgroundColor: string;
  borderColor: string;
  parentContainer: Container | null;

  constructor({ name, color = 'black', backgroundColor = 'white', borderColor = 'transparent', parentContainer = null }
    : { name: string, color?: string, backgroundColor?: string, borderColor?: string, parentContainer?: Container | null }) {

    this.name = name;
    this.color = color;
    this.backgroundColor = backgroundColor;
    this.borderColor = borderColor;
    this.parentContainer = parentContainer;
  }

  getName(): string {
    return this.name;
  }

  getColor(): string | null {
    return this.color;
  }

  getBackgroundColor(): string | null {
    return this.backgroundColor;
  }

  abstract addChild(child: Element): void;

  abstract removeChild(child: Element): void;

  abstract get isLeaf(): boolean;

}

export { Element };