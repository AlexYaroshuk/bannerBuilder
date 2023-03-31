import { ElementContainer } from "@/models/container";

abstract class Element {
  name: string
  color: string;
  backgroundColor: string;
  parentContainer: ElementContainer | null;

  constructor({ name, color='black', backgroundColor='white' }
    : { name: string, color: string, backgroundColor: string }) {
    
    this.name = name;
    this.color = color;
    this.backgroundColor = backgroundColor;
    this.parentContainer = null;
  }

  getName(): string {
    return this.name;
  }

  getColor(): string | null {
    return this.color;
  }

  getBackgroundColot(): string | null {
    return this.backgroundColor;
  }

  abstract addChild(child: Element): void;

  abstract removeChild(child: Element): void;

  abstract get isLeaf(): boolean;

}

export { Element };