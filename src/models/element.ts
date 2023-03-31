import { ElementContainer } from "@/models/container";

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

export { Element };