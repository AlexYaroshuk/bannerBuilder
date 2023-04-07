import { Element } from "@/models/element";

class Container extends Element {
    isHovered: boolean;
    isSelected: boolean;
    isWidgetDropzonesShown: boolean;
    children: Element[];
    borderRadius: number;
    borderWidth: number;
    BGImage: string | null;

    constructor({ name, children, color = 'black', backgroundColor = 'teal', borderColor = 'transparent', parentContainer = null }
        : { name: string, children: Element[], backgroundColor?: string, color?: string, borderColor?: string, parentContainer?: Container | null }) {

        super({ name: name, backgroundColor: backgroundColor, color: color, borderColor: borderColor, parentContainer: parentContainer });

        this.children = children;
        this.isHovered = false;
        this.isSelected = false;
        this.isWidgetDropzonesShown = false;
        this.borderRadius = 0;
        this.borderWidth = 0;
        this.BGImage = null;

    }

    addChild(child: Element): void {
        this.children.push(child);
        child.parentContainer = this; // Set the parentContainer property of the child
    }

    removeChild(child: Element): void {
        const index = this.children.indexOf(child);
        if (index >= 0) {
            this.children.splice(index, 1);
        }
    }

    getChildren(): Element[] {
        return this.children;
    }

    get isLeaf(): boolean {
        return false;
    }
}

export { Container }