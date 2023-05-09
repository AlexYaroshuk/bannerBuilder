import { Container } from "@/models/container";

type BackgroundLayer = {
  type: "color" | "gradient" | "image";
  value: string | GradientLayer;
  position?: string;
  size?: "custom" | "contain" | "cover";
  width?: number | "auto";
  height?: number | "auto";
  repeat?: string;
  layerIndex: number;
  fileName?: string;
};

interface HybridStyles {
  color: string | null;
  fontFamily: string | null;
  fontWeight: number | null;
  fontSize: number | null;
}

interface ContainerStyles {
  background: BackgroundLayer[] | null;
}

interface GradientPoint {
  left: number;
  color: string;
}

interface GradientLayer {
  type: "linear" | "radial";
  degree?: number;
  points: GradientPoint[];
}

abstract class Element {
  name: string;
  color: string | null;
  fontFamily: string | null;
  fontWeight: number | null;
  fontSize: number | null;
  background: BackgroundLayer[] | null;
  borderColor: string | null;
  parentContainer: Container | null;

  constructor({
    name,
    color = null,
    fontFamily = null,
    fontWeight = null,
    fontSize = null,
    background = [],
    borderColor = null,
    parentContainer = null,
  }: {
    name: string;
    color: string | null;
    fontFamily?: string | null;
    fontWeight?: number | null;
    fontSize?: number | null;
    background?: BackgroundLayer[];
    borderColor?: string | null;
    parentContainer?: Container | null;
  }) {
    this.name = name;
    this.color = color;
    this.fontFamily = fontFamily;
    this.fontWeight = fontWeight;
    this.fontSize = fontSize;
    this.borderColor = borderColor;
    this.parentContainer = parentContainer;
    this.background = background.map((bg) => ({
      ...bg,
      position: bg.position || "center center",
      size: bg.size || "custom",
      width: bg.width || "auto",
      height: bg.height || "auto",
    }));
  }

  abstract readonly type: string;

  getName(): string {
    return this.name;
  }

  getColor(): string | null {
    return this.color;
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
      color:
        this.color || (parent && parent.color) || (root && root.color) || null,
      fontFamily:
        this.fontFamily ||
        (parent && parent.fontFamily) ||
        (root && root.fontFamily) ||
        null,
      fontWeight:
        this.fontWeight ||
        (parent && parent.fontWeight) ||
        (root && root.fontWeight) ||
        null,
      fontSize:
        this.fontSize ||
        (parent && parent.fontSize) ||
        (root && root.fontSize) ||
        null,
    };
  }

  abstract addChild(child: Element): void;

  abstract removeChild(child: Element): void;

  abstract get isLeaf(): boolean;
}

export { Element, ContainerStyles, HybridStyles };
