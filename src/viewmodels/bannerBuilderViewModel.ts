import { Element, BackgroundLayer, State } from "@/models/element";
import { Text } from "@/models/text";
import { Container } from "@/models/container";
import { Link } from "@/models/link";
import { Image, ImageState } from "@/models/image";
import { Video } from "@/models/video";

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

  //background selector
  isBackgroundSelectorVisible: boolean = false;
  selectedBackground = null;

  emits = ["delete-container"];

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

    //* SETUP

    // Initialize states for the containers
    const container1BaseState: State = {
      name: "None",
      style: {
        color: "Black",
        fontFamily: "Arial",
        fontWeight: 400,
        fontSize: 16,
        background: [
          {
            type: "color",
            value: "#f9d7d7ff",
            isVisible: true,
            layerIndex: 1,
          },
        ],
        borderColor: null,
        isVisible: true,
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
    const container2BaseState: State = {
      name: "None",
      style: {
        color: "Black",
        fontFamily: "Arial",
        fontWeight: 400,
        fontSize: 16,
        background: [
          {
            type: "image",
            value: "https://picsum.photos/200/300",
            fileName: "random_picsum_mage",
            layerIndex: 1,
            size: "custom",
            width: "auto",
            height: "auto",
            position: "center center",
            isVisible: true,
          },
          {
            type: "gradient",
            layerIndex: 0,
            size: "custom",
            width: "auto",
            height: "auto",
            position: "center center",
            value: {
              type: "linear",
              degree: 0,
              points: [
                { left: 0, color: "white" }, // White
                { left: 100, color: "grey" }, // Grey
              ],
            },
            isVisible: true,
          },
        ],
        borderColor: null,
        isVisible: true,
        leftMargin: 0,
        rightMargin: 0,
        topMargin: 40,
        bottomMargin: 0,
        leftPadding: 0,
        rightPadding: 0,
        topPadding: 0,
        bottomPadding: 0,
      },
    };
    const container3BaseState: State = {
      name: "None",
      style: {
        color: "Black",
        fontFamily: "Arial",
        fontWeight: 400,
        fontSize: 16,
        background: [
          {
            type: "color",
            value: "#f2a9ffff",
            isVisible: true,
            layerIndex: 1,
          },
        ],
        borderColor: null,
        isVisible: true,
        leftMargin: 0,
        rightMargin: 0,
        topMargin: 0,
        bottomMargin: 0,
        leftPadding: 80,
        rightPadding: 0,
        topPadding: 0,
        bottomPadding: 0,
      },
    };
    const container4BaseState: State = {
      name: "None",
      style: {
        color: "Black",
        fontFamily: "Arial",
        fontWeight: 400,
        fontSize: 16,
        background: [
          {
            type: "video",
            value:
              "https://www.shutterstock.com/shutterstock/videos/1044255715/preview/stock-footage-person-signing-important-document-camera-following-tip-of-the-pen-as-it-signs-crucial-business.webm",

            layerIndex: 1,
            size: "custom",
            width: "auto",
            height: "auto",
            position: "center center",
            isVisible: true,
          },
        ],
        borderColor: null,
        isVisible: true,
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

    const container1_1State: State = {
      name: "None",
      style: {
        color: "Black",
        fontFamily: "Arial",
        fontWeight: 400,
        fontSize: 16,
        background: [
          {
            type: "color",
            value: "blue",
            isVisible: true,
            layerIndex: 1,
          },
        ],
        borderColor: null,
        isVisible: true,
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

    // Initialize Container 1 with the base state
    const container1 = new Container({
      name: "Container 1 with hover style",
      initialState: container1BaseState,
      children: [
        new Text({
          name: "Text 1-1",
          content: {
            text: "Hover this to change bg color",
          },
        }),
        new Container({
          name: "Nested container",
          initialState: container1_1State,
          children: [
            new Text({
              name: "Text 1-1-1",
              content: {
                text: "Example text",
              },
            }),
          ],
        }),
      ],
    });
    const container2 = new Container({
      name: "Container 2",
      initialState: container2BaseState,
      children: [
        new Text({
          name: "Text 1-1",
          content: {
            text: "Example text 2",
          },
        }),
      ],
    });
    const container3image = new Image({
      name: "Example image",
      content: {
        value:
          "https://i.ytimg.com/vi/lbtzj2qmlbo/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLBIB5isuVvKZNb6CS1fcF_06rg0mw",
      },
    });

    const container3video = new Video({
      name: "Example video",
      content: {
        value:
          "https://www.shutterstock.com/shutterstock/videos/1044255715/preview/stock-footage-person-signing-important-document-camera-following-tip-of-the-pen-as-it-signs-crucial-business.webm",
      },
    });

    // Modify the Hover state for the image
    const hoverStateImage = container3image.states.find(
      (state) => state.name === "Hover"
    );
    if (hoverStateImage) {
      hoverStateImage.content = {
        value:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiraZs4KG8Xc4rYWxL9lyrnI18rrvreSB5sQ&usqp=CAU",
      };
    }

    // Modify the Hover state for the video
    const hoverStateVideo = container3video.states.find(
      (state) => state.name === "Hover"
    );
    if (hoverStateVideo) {
      hoverStateVideo.content = {
        value:
          "https://www.shutterstock.com/shutterstock/videos/1007271829/preview/stock-footage-abstract-red-and-white-background-of-ink-blood-or-smoke-flows-is-kaleidoscope-or-rorschach-inkblot.webm",
      };
    }
    const container3 = new Container({
      name: "Container 3",
      initialState: container3BaseState,
      children: [
        new Text({
          name: "Text 1-1",
          content: {
            text: "Hover video or image to change content",
          },
        }),
        container3image,
        container3video,
      ],
    });

    const container4 = new Container({
      name: "Container 4",
      initialState: container4BaseState,
      children: [
        new Link({
          name: "Link 3",
          content: {
            label: "Example link",
            url: "https://www.example.com",
          },
        }),
      ],
    });

    // Modify the Hover state
    const hoverState = container1.states.find(
      (state) => state.name === "Hover"
    );
    if (hoverState) {
      hoverState.style.background = [
        {
          type: "color",
          value: "#fff38aff",
          isVisible: true,
          layerIndex: 1,
        },
      ];
    }

    if (hoverState) {
      hoverState.style.background = [
        {
          type: "color",
          value: "#fff38aff",
          isVisible: true,
          layerIndex: 1,
        },
      ];
    }

    this.rootContainer = new Container({
      name: "Root",
      children: [container1, container2, container3, container4],
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

  //property getters
  getSelectedElementCurrentState(): State | null {
    return this.currentSelectedElement
      ? this.currentSelectedElement.currentState
      : null;
  }

  handleElementSelected(element: Element): void {
    this.currentSelectedElement = element;
    this.isBackgroundSelectorVisible = false;
    console.log(element.currentState.style);
  }

  handleElementHovered(element: Element): void {
    this.currentHoveredElement = element;
    element.changeState("Hover");
  }

  handleElementDeselected() {
    this.currentSelectedElement = this.rootContainer;
    this.isBackgroundSelectorVisible = false;
    this.selectedBackground = null;
  }

  handleDragStart(): void {
    this.currentHoveredElement = null;
  }

  handleElementDehovered(): void {
    if (!this.currentHoveredElement) return;
    this.currentHoveredElement.changeState("None");
    this.currentHoveredElement = null;
  }

  hoverItem(item: Element) {
    this.currentHoveredElement = item;
  }

  dehover() {
    this.currentHoveredElement = null;
  }

  existingElementDragStart(
    {
      element,
      type,
      containerIndex,
    }: {
      element: Element;
      index: number;
      type: string;
      containerIndex: number;
    },
    event: DragEvent,
    source: string
  ) {
    this.isDraggingExistingElement = true;
    this.dragSource = source;
    this.draggedElement = element;
    this.draggedElementindex = this.rootContainer.children.indexOf(element);
    console.log(this.draggedElementindex, this.draggedElement?.type);

    /*       this.draggedContainerIndex = index; */
    if (type === "container") {
      this.draggedContainerIndex = this.draggedElementindex;
    }
  }

  /* assetsDragStart({ item, type, }: { item: any; index: number; type: string; containerIndex: number },) {
        this.draggedElement = { item, type };
        this.isDraggingAssetsElement = true;
    } */

  //mutate element
  removeBackground(background: BackgroundLayer) {
    const index =
      this.currentSelectedElement?.currentState.style.background?.indexOf(
        background
      );
    if (index !== -1) {
      this.currentSelectedElement?.currentState.style.background?.splice(
        background.layerIndex,
        1
      );

      // Update layerIndex values of remaining backgrounds
      this.currentSelectedElement?.currentState.style.background?.forEach(
        (bg, i) => {
          bg.layerIndex = i;
        }
      );
    }
  }

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
    console.log(this.draggedElement);
  }

  //drop

  dropContainer(element: Element) {
    if (!this.draggedElement) return;

    if (this.isDraggingAssetsElement) {
      this.addNewContainer();
    } else if (this.isDraggingExistingElement) {
      this.moveExistingContainer(this.hoverIndex!, this.draggedContainerIndex!);
      console.log("yes");
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
    console.log(container);
  }

  createNewElement(container: Container, type: string): Element {
    let newElement: Element;
    console.log(this.draggedElement!.type);
    console.log(type);

    switch (type) {
      case "text":
        newElement = new Text({ name: "Text 3", content: { text: "new" } });
        break;
      case "link":
        newElement = new Link({
          name: "Link 3",
          content: {
            label: "Link 3",
            url: "https://www.example.com",
          },
        });
        break;

      case "image":
        newElement = new Image({
          name: "Link 3",
          content: {
            value: "https://picsum.photos/200/300",
          },
        });
        break;
      case "video":
        newElement = new Video({
          name: "Video 1",
          content: {
            value:
              "https://www.shutterstock.com/shutterstock/videos/1044255715/preview/stock-footage-person-signing-important-document-camera-following-tip-of-the-pen-as-it-signs-crucial-business.webm",
          },
        });
        break;
      default:
        throw new Error(`Unsupported element type: ${type}`);
    }

    console.log(container, newElement);
    container.addChild(newElement);
    return newElement;
  }

  addNewContainer() {
    const newContainer = this.createNewElementContainer(
      this.rootContainer.children.length
    );
    const backgroundColorLayer: BackgroundLayer = {
      type: "color",
      value: "#" + Math.floor(Math.random() * 16777215).toString(16),
      layerIndex: 0,
      isVisible: true,
    };
    newContainer.addBackgroundLayer(backgroundColorLayer);
    this.rootContainer.children.splice(this.hoverIndex!, 0, newContainer);
  }

  createNewElementContainer(totalContainers: number) {
    const newContainerName = `Container ${totalContainers + 1}`;

    const newContainer = new Container({
      name: newContainerName,
      children: [],
      parentContainer: this.rootContainer,
    });

    const text1 = new Text({ name: "Text 3", content: { text: "new" } });
    const text2 = new Text({ name: "Text 4", content: { text: "container" } });

    newContainer.addChild(text1);
    newContainer.addChild(text2);

    return newContainer;
  }
}

export { BannerBuilderViewModel };
