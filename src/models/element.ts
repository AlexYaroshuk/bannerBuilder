import { Container } from "@/models/container";

interface HybridStyles {
  color: string | null;
  fontFamily: string | null;
  fontWeight: number | null;
  fontSize: number | null;
  backgroundColor: string | null;
}

interface ContainerStyles {
  backgroundImage: string | null;
  backgroundRepeat: string | null;
  backgroundPosition: string | null;
  backgroundSize: string | null;
}


abstract class Element {
  name: string
  color: string | null;
  fontFamily: string | null;
  fontWeight: number | null;
  fontSize: number | null;
  backgroundColor: string | null;
  borderColor: string | null;
  parentContainer: Container | null;


  constructor({
    name,
    color = null,
    fontFamily = null,
    fontWeight = null,
    fontSize = null,
    backgroundColor = null,
    borderColor = null,
    parentContainer = null,
  }: {
    name: string,
    color: string | null,
    fontFamily?: string | null,
    fontWeight?: number | null,
    fontSize?: number | null,
    backgroundColor?: string | null,
    borderColor?: string | null,
    parentContainer?: Container | null
  }) {
    this.name = name;
    this.color = color;
    this.fontFamily = fontFamily;
    this.fontWeight = fontWeight;
    this.fontSize = fontSize;
    this.backgroundColor = backgroundColor;
    this.borderColor = borderColor;
    this.parentContainer = parentContainer;
  }


  abstract readonly type: string;

  getName(): string {
    return this.name;
  }

  getColor(): string | null {
    return this.color;
  }

  getBackgroundColor(): string | null {
    return this.backgroundColor;
  }

  getRootContainer(): Container | null {
    let current: Container | null = this.parentContainer;

    while (current && current.parentContainer) {
      current = current.parentContainer;
    }

    return current;
  }

  getEffectiveStyles(): HybridStyles {
    const parent = this.parentContainer;
    const root = this.getRootContainer();

    return {
      color: this.color || (parent && parent.color) || (root && root.color) || null,
      fontFamily: this.fontFamily || (parent && parent.fontFamily) || (root && root.fontFamily) || null,
      fontWeight: this.fontWeight || (parent && parent.fontWeight) || (root && root.fontWeight) || null,
      fontSize: this.fontSize || (parent && parent.fontSize) || (root && root.fontSize) || null,
      backgroundColor: this.backgroundColor || (parent && parent.backgroundColor) || (root && root.backgroundColor) || null,


    };
  }






  abstract addChild(child: Element): void;

  abstract removeChild(child: Element): void;

  abstract get isLeaf(): boolean;

}

export { Element, ContainerStyles, HybridStyles };