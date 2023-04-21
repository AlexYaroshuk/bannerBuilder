import { Element, ContainerStyles, HybridStyles } from "@/models/element";

class Container extends Element {
    readonly type: string;
    isWidgetDropzonesShown: boolean;
    children: Element[];
    borderRadius: number;
    borderWidth: number;
    backgroundImage: null;
    backgroundRepeat: string | null;
    backgroundPosition: string | null;
    backgroundSize: string | null;


    constructor({
        name,
        children = [],
        backgroundColor = 'transparent',
        color = 'black',
        fontFamily = 'Arial',
        fontSize = 16,
        fontWeight = 400,
        borderColor = 'transparent',
        parentContainer = null,
        backgroundImage = '',
    }: {
        name: string;
        children?: Element[];
        backgroundColor?: string;
        fontFamily?: string;
        fontSize?: number;
        fontWeight?: number;
        color?: string;
        borderColor?: string;
        parentContainer?: Container | null;
        backgroundImage?: string | null;
    }) {
        super({
            name: name,
            color: color,
            borderColor: borderColor,
            parentContainer: parentContainer,
            fontFamily: fontFamily,
            fontSize: fontSize,
            backgroundColor: backgroundColor,

        });

        this.type = 'container';
        this.isWidgetDropzonesShown = false;
        this.borderRadius = 0;
        this.borderWidth = 0;
        this.backgroundImage = null;
        this.backgroundRepeat = 'no-repeat';
        this.backgroundPosition = 'center';
        this.backgroundSize = 'cover';


        this.children = [];
        for (var child of children) {
            this.addChild(child);
        }
    }

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
        var toId: number = 0;

        fromId = this.children.indexOf(childOne);
        toId = this.children.indexOf(childTwo);

        [this.children[fromId], this.children[toId]] = [this.children[toId], this.children[fromId]];
    }

    getBackgroundImage(): string | null {
        return this.backgroundImage ? `url(${this.backgroundImage})` : null;
    }

    get isLeaf(): boolean {
        return false;
    }

    getEffectiveStyles(): HybridStyles & ContainerStyles {
        const parent = this.parentContainer;
        const root = this.getRootContainer();

        return {
            color: this.color || (parent && parent.color) || (root && root.color) || null,
            fontFamily: this.fontFamily || (parent && parent.fontFamily) || (root && root.fontFamily) || null,
            fontWeight: this.fontWeight || (parent && parent.fontWeight) || (root && root.fontWeight) || null,
            fontSize: this.fontSize || (parent && parent.fontSize) || (root && root.fontSize) || null,
            backgroundColor: this.backgroundColor || (parent && parent.backgroundColor) || (root && root.backgroundColor) || null,
            backgroundImage: this.backgroundImage ? `url(${this.backgroundImage})` : null,
            backgroundRepeat: this.backgroundRepeat || (parent && parent.backgroundRepeat) || (root && root.backgroundRepeat) || null,
            backgroundPosition: this.backgroundPosition || (parent && parent.backgroundPosition) || (root && root.backgroundPosition) || null,
            backgroundSize: this.backgroundSize || (parent && parent.backgroundSize) || (root && root.backgroundSize) || null,
        };
    }


}

export { Container }