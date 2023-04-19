import { Element } from "@/models/element";
import { Text } from "@/models/text";
import { Container } from "@/models/container";
import { ref } from "vue";

class BannerBuilderViewModel {
    rootContainer: any;
    rootContainerSnapshot: Container | null;
    currentSelectedElement: Element | null;
    currentHoveredElement: Element | null;

    constructor() {
        this.rootContainerSnapshot = null;
        this.currentSelectedElement = null;
        this.currentHoveredElement = null;

        this.rootContainer = ref(
            new Container({
                name: "Root", children: [
                    new Container({
                        name: 'Container 1', children: [
                            new Text({ name: "Text 1", text: "foo" }),
                            new Text({ name: "Text 2", text: "bar" }),
                            new Text({ name: "Text 3", text: "sac" }),
                            new Container({
                                name: 'Container 1-1', children: [
                                    new Text({ name: "Text 1-1", text: "das" }),
                                    new Text({ name: "Text 1-2", text: "mor" }),
                                    new Container({
                                        name: 'Container 1-1-2', children: [
                                            new Text({ name: "Text 1-1", text: "das" }),
                                            new Text({ name: "Text 1-2", text: "mor" }),
                                        ]
                                    })
                                ]
                            })
                        ]
                    }),
                    new Container({
                        name: 'Container 2', children: [
                            new Text({ name: "Text 3", text: "tres" }),
                            new Text({ name: "Text 4", text: "cuatro" }),
                        ]
                    }),
                    new Container({
                        name: 'Container 3', children: [
                            new Text({ name: "Text 3", text: "cinco" }),
                            new Text({ name: "Text 4", text: "seis" }),
                        ]
                    }),
                ]
            })
        );
    }

    getRootContainer(): Container {
        return this.rootContainer;
    }

    getSelectedElement(): Element | null {
        return this.currentSelectedElement;
    }

    getHoveredElement(): Element | null {
        return this.currentHoveredElement;
    }

    handleElementSelected(element: Element): void {
        this.currentSelectedElement = element;
    }

    handleDragStart(): void {
        this.currentHoveredElement = null;
    }

    handleHover(element: Element): void {
        this.currentHoveredElement = element;
    }

    handleDehover(): void {
        this.currentHoveredElement = null;
    }
}

export { BannerBuilderViewModel }