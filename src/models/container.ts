import { Element } from "@/models/element";

class ElementContainer extends Element {
    isHovered: boolean;
    isSelected: boolean;
    isWidgetDropzonesShown: boolean;
    children: Element[];
    backgroundColor: string;
    borderColor: string;
    borderRadius: number;
    borderWidth: number;
    BGImage: string | null;

    constructor({ name, children }
        : { name: string, children: Element[] }) {

        super({ name: name });

        this.children = children;
        this.isHovered = false;
        this.isSelected = false;
        this.isWidgetDropzonesShown = false;
        this.backgroundColor = "teal";
        this.color = "black"
        this.borderColor = "transparent";
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

export { ElementContainer }