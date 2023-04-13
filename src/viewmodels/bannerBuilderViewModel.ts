import { Element } from "@/models/element";
import { Text } from "@/models/text";
import { Container } from "@/models/container";
import { ref } from "vue";

class BannerBuilderViewModel {
    rootContainer: any;
    rootContainerSnapshot: Container | null;
    currentDraggedElement: Element | null;
    currentHoveredElement: Element | null;
    isDraggedOutside: boolean;

    constructor() {
        this.rootContainerSnapshot = null;
        this.currentDraggedElement = null;
        this.currentHoveredElement = null;
        this.isDraggedOutside = false;

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
                                        name: 'Container 1-1', children: [
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
                            // new Text({ name: "Text 3", text: "tres" }),
                            // new Text({ name: "Text 4", text: "cuatro" }),
                        ]
                    }),
                    new Container({
                        name: 'Container 3', children: [
                            // new Text({ name: "Text 3", text: "cinco" }),
                            // new Text({ name: "Text 4", text: "seis" }),
                        ]
                    }),
                ]
            })
        );
    }

    getRootContainer(): Container {
        return this.rootContainer;
    }

    handleDragStart(element: Element): void {
        // this.rootContainerSnapshot = { ...this.rootContainer.value };
        // this.rootContainerSnapshot!.getChildren()[0].name = '123';
        this.currentDraggedElement = element;
    }

    handleDragOver(element: Element): void {
        this.currentHoveredElement = element;
        this.isDraggedOutside = false;
        this.rootContainer.swapChildren(this.currentDraggedElement, this.currentHoveredElement);
    }

    handleDrop(): void {
        console.log('handleDrop');
        console.log(this.isDraggedOutside);
        if (this.isDraggedOutside) {
            this.rootContainer = this.rootContainerSnapshot;
        }

        this.resetState()
    }

    handleDragOutside(): void {
        // this.rootContainer = { ...this.rootContainerSnapshot };
        this.isDraggedOutside = true;
        console.log('handleDragOutside');
        console.log(this.isDraggedOutside);
    }

    resetState(): void {
        this.rootContainerSnapshot = null;
        this.currentDraggedElement = null;
        this.currentHoveredElement = null;
        this.isDraggedOutside = false;
    }
}

export { BannerBuilderViewModel }