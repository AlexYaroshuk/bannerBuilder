import { ElementContainer } from "@/models/container";

abstract class Element {
  name: string
  color: string | null;
  parentContainer: ElementContainer | null;

  constructor({ name }
    : { name: string }) {
    
    this.name = name;
    this.color = null;
    this.parentContainer = null;
  }

  abstract addChild(child: Element): void;
  abstract removeChild(child: Element): void;
  abstract get isLeaf(): boolean;

  getName(): string {
    return this.name;
  }
}

export { Element };