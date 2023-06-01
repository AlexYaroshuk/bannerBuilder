import { Container } from "./container";

interface Style {
  color: string | null;
  fontFamily: string | null;
  fontWeight: number | null;
  fontSize: number | null;
  background: BackgroundLayer[] | null;
  borderColor: string | null;
  isVisible: boolean;

  //test
  leftMargin?: number | null;
  rightMargin?: number | null;
  topMargin?: number | null;
  bottomMargin?: number | null;
  leftPadding?: number | null;
  rightPadding?: number | null;
  topPadding?: number | null;
  bottomPadding?: number | null;
}
interface TextContent {
  text: string;
}

interface ImageContent {
  value: string;
}
interface VideoContent {
  value: string;
}
interface LinkContent {
  label: string;
  url: string;
}

interface State {
  name: string;
  style: Style;
  content?: TextContent | ImageContent | VideoContent | LinkContent;
}

type BackgroundSize = "custom" | "contain" | "cover";

type BackgroundLayer = {
  type: "color" | "gradient" | "image" | "video";
  value: string | GradientLayer;
  position?: string;
  size?: "custom" | "contain" | "cover";
  width?: number | "auto";
  height?: number | "auto";
  repeat?: string;
  layerIndex: number;
  fileName?: string;
  isVisible: boolean;
};

/* interface HybridStyles {
  color: string | null;
  fontFamily: string | null;
  fontWeight: number | null;
  fontSize: number | null;
  isVisible: boolean;
}

interface ContainerStyles {
  background: BackgroundLayer[] | null;
} */

interface GradientPoint {
  left: number;
  color: string;
}

interface GradientLayer {
  type: "linear" | "radial";
  degree?: number;
  points: GradientPoint[];
}

const DEFAULT_BACKGROUND_SIZE: BackgroundSize = "custom";
const DEFAULT_BACKGROUND_POSITION = "center center";

abstract class Element {
  name: string;
  states: State[];
  currentState: State;
  parentContainer: Container | null;

  constructor({
    name,
    parentContainer = null,
    initialState = null,
  }: {
    name: string;
    parentContainer?: Container | null;
    initialState?: State | null;
  }) {
    this.name = name;
    this.parentContainer = parentContainer;

    this.states = this.createDefaultStates(initialState);
    this.currentState =
      this.states.find((s) => s.name === "None") || this.states[0];
  }

  createDefaultStates(initialState: State | null): State[] {
    const baseState: State = initialState || {
      name: "None",
      style: {
        color: "Black",
        fontFamily: "Arial",
        fontWeight: 400,
        fontSize: 16,
        background: [],
        borderColor: null,
        isVisible: true,

        //test
        leftMargin: 0,
        rightMargin: 0,
        topMargin: 0,
        bottomMargin: 0,
        leftPadding: 0,
        rightPadding: 0,
        topPadding: 0,
        bottomPadding: 0,
      },
    };

    const hoverState: State = {
      name: "Hover",
      style: {
        color: baseState.style.color,
        fontFamily: baseState.style.fontFamily,
        fontWeight: baseState.style.fontWeight,
        fontSize: baseState.style.fontSize,
        background: baseState.style.background,
        borderColor: baseState.style.borderColor,
        isVisible: baseState.style.isVisible,

        //test
        leftMargin: baseState.style.leftMargin,
        rightMargin: baseState.style.rightMargin,
        topMargin: baseState.style.topMargin,
        bottomMargin: baseState.style.bottomMargin,
        leftPadding: baseState.style.leftPadding,
        rightPadding: baseState.style.rightPadding,
        topPadding: baseState.style.topPadding,
        bottomPadding: baseState.style.bottomPadding,

        //test
      },
    };

    return [baseState, hoverState];
  }

  abstract readonly type: string;

  getName(): string {
    return this.name;
  }

  getStyleProperty(property: keyof Style): any {
    return this.currentState.style[property];
  }

  getRootContainer(): Container | null {
    let current: Container | null = this.parentContainer;

    while (current && current.parentContainer) {
      current = current.parentContainer;
    }

    return current;
  }

  // ! states
  changeState(stateName: string) {
    const newState = this.states.find((state) => state.name === stateName);
    if (newState) {
      this.currentState = newState;
    }
  }

  addState(newState: State) {
    // check if a state with the given name already exists
    const existingState = this.states.find(
      (state) => state.name === newState.name
    );
    if (existingState) {
      throw new Error(`State with name "${newState.name}" already exists`);
    }
    this.states.push(newState);
  }

  getEffectiveStyles(): Style {
    const parent = this.parentContainer;
    const root = this.getRootContainer();

    const styles: Style = {
      color:
        this.currentState.style.color ||
        (parent && parent.currentState.style.color) ||
        (root && root.currentState.style.color) ||
        null,
      fontFamily:
        this.currentState.style.fontFamily ||
        (parent && parent.currentState.style.fontFamily) ||
        (root && root.currentState.style.fontFamily) ||
        null,
      fontWeight:
        this.currentState.style.fontWeight ||
        (parent && parent.currentState.style.fontWeight) ||
        (root && root.currentState.style.fontWeight) ||
        null,
      fontSize:
        this.currentState.style.fontSize ||
        (parent && parent.currentState.style.fontSize) ||
        (root && root.currentState.style.fontSize) ||
        null,
      borderColor:
        this.currentState.style.borderColor ||
        (parent && parent.currentState.style.borderColor) ||
        (root && root.currentState.style.borderColor) ||
        null,
      background: this.currentState.style.background || [],

      isVisible:
        this.currentState.style.isVisible !== undefined
          ? this.currentState.style.isVisible
          : true,

      leftMargin: this.currentState.style.leftMargin,

      rightMargin: this.currentState.style.rightMargin,

      topMargin: this.currentState.style.topMargin,

      bottomMargin: this.currentState.style.bottomMargin,

      leftPadding: this.currentState.style.leftPadding,

      rightPadding: this.currentState.style.rightPadding,

      topPadding: this.currentState.style.topPadding,

      bottomPadding: this.currentState.style.bottomPadding,
    };

    // If background layers exist

    return styles;
  }

  // backgrounds

  getBackground(): BackgroundLayer[] | null {
    return this.currentState.style.background;
  }

  setBackground(background: BackgroundLayer[]): void {
    this.currentState.style.background = background;
  }

  addBackgroundLayer(layer: BackgroundLayer): void {
    this.currentState.style.background = [
      ...(this.currentState.style.background || []),
      layer,
    ];
  }

  moveBackgroundLayer(layerIndex: number, newIndex: number): void {
    if (newIndex >= this.currentState.style.background!?.length) {
      let k = newIndex - this.currentState.style.background!?.length;
      while (k-- + 1) {
        this.currentState.style.background?.push(undefined as any);
      }
    }
  }

  abstract addChild(child: Element): void;

  abstract removeChild(child: Element): void;

  abstract get isLeaf(): boolean;
}

export { Element, BackgroundLayer, State, Style };
