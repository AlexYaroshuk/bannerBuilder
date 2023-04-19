import { Element } from "@/models/element";
import { Text } from "@/models/text";
import { Container } from "@/models/container";
import { Link } from "@/models/link";

class BannerBuilderViewModel {
    rootContainer: Container;
    rootContainerSnapshot: Container | null;
    currentSelectedElement: Element | null;
    currentHoveredElement: Element | null;

    //Select and hover
    selectedItem: Element | null = null;
    hoveredItem: Element | null = null;

    // Dragging
    draggedElement: Element | null = null;
    isDraggingExistingElement: boolean = false;
    isDraggingAssetsElement: boolean = false;
    isDraggingWidgetElement: boolean = false;

    dragSource: string | null = null;

    hoverIndex: number | null = null;
    draggedElementindex: number | null = null;
    draggedContainerIndex: number | null = null;

    emits = ["delete-container",];

    constructor() {
        this.rootContainerSnapshot = null;
        this.currentSelectedElement = null;
        this.currentHoveredElement = null;

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
            name: "Root",
            children: [
                new Container({
                    name: 'Container 1',
                    backgroundColor: "white",
                    color: "purple",
                    children: [
                        new Text({ name: "Text 1-1", text: "das" }),
                        new Text({ name: "Text 1-2", text: "mor" }),
                        new Container({
                            name: 'Container 1-1',
                            backgroundColor: '',
                            color: 'green',
                            fontFamily: 'Helvetica',
                            fontSize: 24,
                            children: [
                                new Text({ name: "Text 1-1-1", text: "baz", }),
                                new Text({ name: "Text 1-1-2", text: "wee" })
                            ]
                        })
                    ]
                }),
                new Container({
                    name: 'Container 2',
                    backgroundColor: 'brown',
                    color: 'green',
                    fontFamily: 'Helvetica',
                    fontSize: 24,
                    children: [
                        new Text({ name: "Text 1-1-1", text: "baz", }),
                        new Text({ name: "Text 1-1-2", text: "wee" })
                    ]
                }),
            ],
        });
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

    handleElementHovered(element: Element): void {
        this.currentHoveredElement = element;
    }

    handleElementDeselected() {
        this.currentSelectedElement = this.rootContainer;
    }

    handleDragStart(): void {
        this.currentHoveredElement = null;
    }

    handleElementDehovered(): void {
        this.currentHoveredElement = null;
    }

    hoverItem(item: Element) {
        this.currentHoveredElement = item;
    }

    dehover() {
        this.currentHoveredElement = null;
    }

    existingElementDragStart(
        { element, type, containerIndex }: { element: Element; index: number; type: string; containerIndex: number },
        event: DragEvent,
        source: string,
    ) {
        this.isDraggingExistingElement = true;
        this.dragSource = source;
        this.draggedElement = element;
        this.draggedElementindex = this.rootContainer.children.indexOf(element);
        console.log(this.draggedElementindex, this.draggedElement?.type)


        /*       this.draggedContainerIndex = index; */
        if (type === "container") {
            this.draggedContainerIndex = this.draggedElementindex;

        }



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
    widgetDragStart(element: Element) {
        this.draggedElement = element;
        this.isDraggingWidgetElement = true;
        console.log(this.draggedElement)
    }


    //drop

    dropContainer(element: Element) {

        if (!this.draggedElement) return;

        if (this.isDraggingAssetsElement) {
            this.addNewContainer();
        } else if (this.isDraggingExistingElement) {
            this.moveExistingContainer(this.hoverIndex!, this.draggedContainerIndex!);
            console.log('yes')
        }
        this.handleDragEnd();
    }

    // mutate

    moveExistingContainer(
        targetIndex: number,
        draggedContainerIndex: number,
        fromTree = false
    ) {
        // Check if the targetIndex is different from draggedContainerIndex
        if (targetIndex !== draggedContainerIndex) {
            const draggedContainer = this.rootContainer.children.splice(
                draggedContainerIndex,
                1
            )[0];

            if (!fromTree && targetIndex > draggedContainerIndex) {
                targetIndex--;
            }

            this.rootContainer.children.splice(targetIndex, 0, draggedContainer);
        }
    }

    dropWidget(container: Container) {
        const newElement = this.createNewElement(
            container,
            this.draggedElement!.type
        );
        this.handleElementSelected(newElement);
        console.log(container)
    }

    createNewElement(container: Container, type: string): Element {
        let newElement: Element;
        console.log(this.draggedElement!.type)
        console.log(type)


        switch (type) {
            case "text":
                newElement = new Text({ name: "Text 3", text: "new" });
                break;
            case "link":
                newElement = new Link({ name: "Link 3", label: "Link 3", url: "https://www.example.com" });
                break;
            default:
                throw new Error(`Unsupported element type: ${type}`);
        }
        console.log(container, newElement)
        container.addChild(newElement);
        return newElement;
    }


    addNewContainer() {
        const newContainer = this.createNewElementContainer(
            this.rootContainer.children.length
        );

        const getRandomColor = () => {
            const randomColor =
                "#" + Math.floor(Math.random() * 16777215).toString(16);
            return randomColor;
        };

        newContainer.backgroundColor = getRandomColor();

        this.rootContainer.children.splice(this.hoverIndex!, 0, newContainer);
    }

    createNewElementContainer(totalContainers: number) {
        const newContainerName = `Container ${totalContainers + 1}`;

        const newContainer = new Container({
            name: newContainerName,
            children: [],
        });

        const text1 = new Text({ name: "Text 3", text: "new" });
        const text2 = new Text({ name: "Text 4", text: "container" });

        newContainer.addChild(text1);
        newContainer.addChild(text2);

        return newContainer;
    }
}

export { BannerBuilderViewModel }


