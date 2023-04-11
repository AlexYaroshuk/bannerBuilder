import { Text } from "@/models/text";
import { Container } from "@/models/container";

interface TreeDropPayload {
    item: any;
    index: number;
    type: string;
    containerIndex: number;
}
class BannerBuilderViewModel {
    //Select and hover
    selectedItem: object | null = null;
    hoveredItem: object | null = null;

    // Dragging
    draggedElement: object | null = null;
    isDraggingExistingElement: boolean = false;
    isDraggingAssetsElement: boolean = false;
    isDraggingWidgetElement: boolean = false;

    dragSource: string | null = null;

    hoverIndex: number | null = null;
    draggedContainerIndex: number | null = null;


    rootContainer: Container;

    emits = ["delete-container",];

    constructor() {
        this.selectedItem = null;
        this.hoveredItem = null;
        this.draggedElement = null;
        this.isDraggingExistingElement = false;
        this.isDraggingAssetsElement = false;
        this.isDraggingWidgetElement = false;
        this.dragSource = null;
        this.hoverIndex = null;
        this.draggedContainerIndex = null;

        this.rootContainer = new Container({
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
                            ]
                        })
                    ]
                }),
                new Container({
                    name: 'Container 2', children: [
                        new Text({ name: "Text 3", text: "baz" }),
                        new Text({ name: "Text 4", text: "wee" }),
                    ]
                }),
            ]
        });
    }

    getRootContainer(): Container {
        return this.rootContainer;
    }



    //UI events
    /*     selectItem(item: Container | Text, callback: (eventName: string, payload: any) => void) {
            this.selectedItem = item;
    
        }
    
        hoverItem(item: Container | Text, callback: (eventName: string, payload: any) => void) {
            this.hoveredItem = item;
    
        } */



    ////drag&drop
    //hybrid objects


    existingElementDragStart(
        { item, index, type, containerIndex }: { item: any; index: number; type: string; containerIndex: number },
        event: DragEvent,
        source: string,
        callback: (eventName: string, payload: any) => void
    ) {
        this.draggedContainerIndex = index;
        this.draggedElement = { item, index, type, containerIndex };
        if (type === "container") {
            this.draggedContainerIndex = index;

        }

        this.isDraggingExistingElement = true;
        this.dragSource = source;

    }

    /* assetsDragStart({ item, type, }: { item: any; index: number; type: string; containerIndex: number },) {
        this.draggedElement = { item, type };
        this.isDraggingAssetsElement = true;
    } */




    handleDragEnd() {
        this.draggedElement = null;
        this.isDraggingExistingElement = false;
        this.isDraggingAssetsElement = false;
        this.isDraggingWidgetElement = false;
        this.dragSource = null;
        this.hoverIndex = null;
        this.draggedContainerIndex = null;


    }

    //widgets
    widgetDragStart(element: object) {
        this.draggedElement = element;
        this.isDraggingWidgetElement = true;
    }
}

export { BannerBuilderViewModel }