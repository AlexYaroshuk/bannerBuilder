import { Element } from "@/models/element";

class ElementContainer extends Element {
    name: string;
    isHovered: boolean;
    isSelected: boolean;
    isWidgetDropzonesShown: boolean;
    type: string;
    children: Element[];
    backgroundColor: string;
    borderColor: string;
    borderRadius: number;
    borderWidth: number;
    BGImage: string | null;

    constructor({ name, children }
        : { name: string, children: Element[] }) {

        super();
        this.name = name;
        this.children = children;

        this.isHovered = false;
        this.isSelected = false;
        this.isWidgetDropzonesShown = false;
        this.type = "container";
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

    get isLeaf(): boolean {
        return false;
    }
}

export { ElementContainer }