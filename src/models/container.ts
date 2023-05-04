import { Element, HybridStyles } from "@/models/element";

type BackgroundSize = "custom" | "contain" | "cover";

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

interface GradientPoint {
    left: number;
    red: number;
    green: number;
    blue: number;
    alpha: number;
}



interface GradientLayer {
    type: 'linear' | 'radial';
    degree?: number;
    points: GradientPoint[];
}


const DEFAULT_BACKGROUND_SIZE: BackgroundSize = "custom";
const DEFAULT_BACKGROUND_POSITION = "center center";

interface ContainerStyles {
    background: BackgroundLayer[];
    backgroundRepeat?: string;
    backgroundPosition?: string;
    backgroundSize?: BackgroundSize;
}

class Container extends Element {
    readonly type: string;
    isWidgetDropzonesShown: boolean;
    children: Element[];
    borderRadius: number;
    background: BackgroundLayer[] = [];

    constructor({
        name,
        children = [],
        background = [],
        fontFamily = "Arial",
        fontSize = 16,
        fontWeight = 400,
        color = "black",
        parentContainer = null,
    }: {
        name: string;
        children?: Element[];
        background?: BackgroundLayer[];
        fontFamily?: string;
        fontSize?: number;
        fontWeight?: number;
        color?: string;
        parentContainer?: Container | null;
    }) {
        super({
            name: name,
            color: color,
            parentContainer: parentContainer,
            fontFamily: fontFamily,
            fontSize: fontSize,
            fontWeight: fontWeight,
        });

        this.type = "container";
        this.isWidgetDropzonesShown = false;
        this.borderRadius = 0;
        this.background = background;

        this.children = [];
        for (var child of children) {
            this.addChild(child);
        }
    }

    getEffectiveStyles(): HybridStyles & ContainerStyles {
        const parent = this.parentContainer;
        const root = this.getRootContainer();

        const styles: HybridStyles & ContainerStyles = {
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
                this.fontSize || (parent && parent.fontSize) || (root && root.fontSize) || null,
            background: this.background || null,
        };

        if (this.background.some((bg) => bg.type === "image")) {
            styles.backgroundRepeat =
                this.background.find((bg) => bg.type === "image")?.repeat || "no-repeat";
            styles.backgroundPosition =
                this.background.find((bg) => bg.type === "image")?.position || DEFAULT_BACKGROUND_POSITION;
            styles.backgroundSize =
                this.background.find((bg) => bg.type === "image")?.size || DEFAULT_BACKGROUND_SIZE;
        }

        if (this.background.some((bg) => bg.type === "gradient")) {
            styles.backgroundRepeat = 'no-repeat';
            styles.backgroundPosition = DEFAULT_BACKGROUND_SIZE;
            styles.backgroundSize = DEFAULT_BACKGROUND_SIZE;
        }

        return styles;
    }

    // backgrounds

    getBackground(): BackgroundLayer[] {
        return this.background;
    }

    setBackground(background: BackgroundLayer[]): void {
        this.background = background;
    }

    addBackgroundLayer(layer: BackgroundLayer): void {
        this.background.push(layer);
    }

    moveBackgroundLayer(layerIndex: number, newIndex: number): void {
        if (newIndex >= this.background.length) {
            let k = newIndex - this.background.length;
            while (k-- + 1) {
                this.background.push(undefined as any);
            }
        }
    }

    // * children

    getChildren(): Element[] {
        return this.children;
    }


    addChild(child: Element): void {
        child.parentContainer = this;
        this.children.push(child);
    }

    removeChild(child: Element): void {
        const index = this.children.indexOf(child);
        if (index >= 0) {
            this.children.splice(index, 1);
        }
    }

    swapChildren(childOne: Element, childTwo: Element): void {
        var fromId: number = 0;
        var toId: number = 0; fromId = this.children.indexOf(childOne);
        toId = this.children.indexOf(childTwo);

        [this.children[fromId], this.children[toId]] = [this.children[toId], this.children[fromId]];
    }

    get isLeaf(): boolean {
        return false;
    }
}

export { Container, BackgroundLayer };
