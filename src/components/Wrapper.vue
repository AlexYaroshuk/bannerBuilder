<template>
  <div class="wrapper" ref="wrapper">
    <LayoutCanvas
      :viewModel="this.viewModel"
      @delete-element="deleteElement"
      @delete-key-press="deleteContainer"
      @delete-container="deleteElement"
      @handleContainerDrop="handleContainerDrop($event)"
      @handleWidgetDrop="handleWidgetDrop($event.container, $event.widget)"
      ref="layoutcanvas"
    />
    <Properties
      :viewModel="this.viewModel"
      @reset-style="onResetStyle"
      @set-typography-color="onUpdateTypographyColor"
      @set-typography-fontsize="onUpdateTypographyFontsize"
      @set-typography-fontfamily="onUpdateTypographyFontfamily"
      @set-bg-color="onUpdateBGColor"
      ref="properties"
    />

    <LeftSidebar
      :viewModel="this.viewModel"
      @contextmenu="showContextMenu"
      @drag-start="
        handleDragStart(
          {
            item: $event.item,
            index: $event.index,
            type: $event.type,
            containerIndex: $event.containerIndex,
          },
          $event.event,
          'tree'
        )
      "
      @drop="handleTreeDrop"
      ref="leftsidebar"
    />
  </div>
  <div
    class="context-menu"
    :style="{
      top: contextMenu.top,
      left: contextMenu.left,
      display: contextMenu.isVisible ? 'block' : 'none',
    }"
  >
    <div class="context-menu-row" @click="deleteElement">
      <span class="action">Delete</span>
      <span class="hotkey">Ctrl+D</span>
    </div>
  </div>
</template>

<script>
import ElementContainer from "./ElementContainer.vue";
import Properties from "./Properties.vue";
import LeftSidebar from "./LeftSidebar.vue";
import LayoutCanvas from "./LayoutCanvas.vue";
import { BannerBuilderViewModel } from "../viewmodels/bannerBuilderViewModel";

export default {
  components: {
    ElementContainer,
    Properties,
    LeftSidebar,
    LayoutCanvas,
  },

  /* mixins: [appSetup, newContainerMixin], */

  data() {
    /* const { containers } = appSetup.setup(); */
    return {
      viewModel: new BannerBuilderViewModel(),
      //context
      contextMenu: {
        isVisible: false,
        top: 0,
        left: 0,
        container: null,
      },
    };
  },

  computed: {
    dropzoneHovered() {
      return (index) =>
        this.isDraggingExistingElement && this.hoverIndex === index;
    },
  },

  mounted() {
    /* window.addEventListener("keydown", this.handleDeleteKeyPress); */
    document.addEventListener("click", this.handleClickOutside);
    this.viewModel.handleElementSelected(this.viewModel.rootContainer);
  },

  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
    /* window.removeEventListener("keydown", this.handleDeleteKeyPress); */
  },
  methods: {
    // || UI CONTROL
    //
    /// globals

    showContextMenu(event, container) {
      event.preventDefault();

      this.contextMenu.isVisible = true;
      this.contextMenu.top = event.clientY + "px";
      this.contextMenu.left = event.clientX + "px";
      this.contextMenu.container = container;
    },

    handleClickOutside(event) {
      const wrapper = this.$refs.wrapper;
      const leftsidebar = this.$refs.leftsidebar;
      const properties = this.$refs.properties;

      if (
        this.contextMenu.isVisible &&
        !event.target.closest(".context-menu") &&
        wrapper.contains(event.target)
      ) {
        this.contextMenu.isVisible = false;
      }

      // Check if the click event is not inside Leftsidebar or Properties components
      if (
        !leftsidebar.$el.contains(event.target) &&
        !properties.$el.contains(event.target)
      ) {
        this.deselectAll();
        this.dehoverAll();
      }
    },

    /*     handleDeleteKeyPress(event) {
      if (event.key === "Delete") {
        if (this.selectedItem.type != "container") {
          this.deleteChild();
        } else {
          this.deleteContainer();
        }
      }
    }, */

    updateHoverIndex(index) {
      if (this.isDraggingExistingElement || this.isDraggingAssetsElement) {
        if (
          this.dragSource === "main" &&
          this.draggedElement.containerIndex < index
        ) {
          index--;
        }
        this.hoverIndex = index;
      } else {
        this.hoverIndex = null;
      }
    },

    //
    ///select, hover, deselect, dehover

    deselectAll() {
      this.viewModel.handleElementDeselected();
    },

    dehoverAll() {
      this.viewModel.handleElementDehovered();
    },

    //
    /// drag
    updateDraggedElement(draggedElement) {
      this.draggedElement = draggedElement;
    },
    handleDragStart({ item, index, type, containerIndex }, event, source) {
      this.isDraggingExistingElement = source !== "assets";
      this.isDraggingAssetsElement = source === "assets";

      this.dragSource = source;

      this.draggedContainerIndex = index;

      this.draggedElement = { item, index, type, containerIndex };

      if (event && event.dataTransfer) {
        event.dataTransfer.setData("text/plain", ""); // for Firefox compatibility
      }
      this.draggedElement = { item, index, type, containerIndex };
      if (type === "container") {
        this.draggedContainerIndex = index;
      }
      this.draggedElement = { item, index, type, containerIndex };
      if (type === "container") {
        this.draggedContainerIndex = index;
      }
      this.draggedElement = { item, index, type, containerIndex };

      this.dragSource = source;

      let containerElement;

      if (source === "main") {
        // Remove the dragged container
        containerElement = event.target.closest(".container");

        // Create a clone of the container element
        const floatingContainer = containerElement.cloneNode(true);
        floatingContainer.classList.add("floating-container");

        // Remove default drag ghost image
        const dragImage = new Image();
        dragImage.src =
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'/%3E";
        event.dataTransfer.setDragImage(dragImage, 0, 0);

        const rect = containerElement.getBoundingClientRect();
        const halfWidth = rect.width / 2;
        const halfHeight = rect.height / 2;

        // Set the initial position and append it to the body
        floatingContainer.style.left = `${event.clientX - halfWidth}px`;
        floatingContainer.style.top = `${event.clientY - halfHeight}px`;
        document.body.appendChild(floatingContainer);

        // Assign the floating container
        this.floatingContainer = floatingContainer;

        requestAnimationFrame(() => {
          containerElement.style.display = "none";
        });
      }

      if (source === "main" || "tree") {
        this.isDraggingExistingElement = true;
      }
      if (source === "assets") {
        this.isDraggingAssetsElement = true;
      }
      if (source === "widgets") {
        this.isDraggingWidgetsElement = true;
        this.draggedWidget = event.widget;
      }

      if (!containerElement) return;
    },

    updateFloatingContainerPosition(event) {
      if (this.floatingContainer) {
        const containerWidth = this.floatingContainer.offsetWidth;
        const containerHeight = this.floatingContainer.offsetHeight;
        const x = event.clientX - containerWidth / 2;
        const y = event.clientY - containerHeight / 2;
        this.floatingContainer.style.left = x + "px";
        this.floatingContainer.style.top = y + "px";
      }
    },

    handleContainerDrop({
      event,
      containerIndex,

      draggedContainerIndex,
    }) {
      event.preventDefault();
      if (!this.viewModel.draggedElement) return;

      if (this.viewModel.isDraggingAssetsElement) {
        this.addNewContainer(containerIndex);
      } else if (this.viewModel.isDraggingExistingElement) {
        this.moveExistingContainer(containerIndex, draggedContainerIndex);
      }
    },

    handleTreeDrop({ item, index, type, containerIndex }) {
      if (!this.draggedElement) return;

      const from = this.draggedElement;

      // Handle container drag and drop
      if (from.type === "container" && type === "container") {
        this.moveExistingContainer(index, this.draggedContainerIndex, true);
      }
      // Handle child drag and drop within the same container
      else if (
        from.type === "child" &&
        type === "child" &&
        from.containerIndex === containerIndex
      ) {
        this.moveChildWithinContainer(from, index, containerIndex);
      }
      // Handle child drag and drop between different containers
      else if (
        from.type === "child" &&
        type === "child" &&
        from.containerIndex !== containerIndex
      ) {
        this.moveChildBetweenContainers(from, index, containerIndex);
      }
      // Handle child drag and drop onto container
      else if (from.type === "child" && type === "container") {
        this.moveChildToContainer(from, item);
      }
    },

    // || DATA MUTATIONS
    //
    /// delete element

    deleteElement() {
      if (this.viewModel.getSelectedElement().type === "container") {
        console.log(this.viewModel.getSelectedElement().type);

        this.viewModel.rootContainer.children =
          this.viewModel.rootContainer.children.filter(
            (container) => container !== this.viewModel.getSelectedElement()
          );
      } else {
        console.log(this.viewModel.getSelectedElement().type);
        this.viewModel
          .getSelectedElement()
          .parentContainer.children.forEach((container) => {
            this.viewModel.getSelectedElement().parentContainer.children =
              this.viewModel
                .getSelectedElement()
                .parentContainer.children.filter(
                  (child) => child != this.viewModel.getSelectedElement()
                );
          });
      }
      this.contextMenu.isVisible = false;
    },

    /// add an element

    addNewContainer(containerIndex) {
      const newContainer = this.createNewElementContainer(
        this.containers.length
      );
      this.containers.splice(containerIndex, 0, newContainer);
    },

    handleWidgetDrop(container, widget) {
      const newElement = this.createNewElement(
        container,
        this.viewModel.draggedElement.type
      );
      this.viewModel.selectItem(newElement);
    },

    /// move an element

    moveExistingContainer(
      targetIndex,
      draggedContainerIndex,
      fromTree = false
    ) {
      // Check if the targetIndex is different from draggedContainerIndex
      if (targetIndex !== draggedContainerIndex) {
        const draggedContainer = this.containers.splice(
          draggedContainerIndex,
          1
        )[0];

        if (!fromTree && targetIndex > draggedContainerIndex) {
          targetIndex--;
        }

        this.containers.splice(targetIndex, 0, draggedContainer);
      }
    },
    moveChildWithinContainer(from, index, containerIndex) {
      const draggedChild = this.containers[containerIndex].children.splice(
        from.index,
        1
      )[0];
      this.containers[containerIndex].children.splice(
        index !== null
          ? index
          : this.containers[containerIndex].children.length,
        0,
        draggedChild
      );
    },

    moveChildBetweenContainers(from, index, containerIndex) {
      const draggedChild = this.containers[from.containerIndex].children.splice(
        from.index,
        1
      )[0];

      // Update the parent reference
      draggedChild.parentContainer = this.containers[containerIndex];

      this.containers[containerIndex].children.splice(
        index !== null
          ? index
          : this.containers[containerIndex].children.length,
        0,
        draggedChild
      );
    },

    moveChildToContainer(from, item) {
      const draggedChild = this.containers[from.containerIndex].children.splice(
        from.index,
        1
      )[0];
      item.children.push(draggedChild);
    },

    //
    /// modify child object (text)

    onUpdateTextElementColor({ child, color }) {
      if (color === null) {
        child.backgroundColor = this.defaultColors[child.index];
      } else {
        child.backgroundColor = color;
      }
    },

    onResetStyle({ type }) {
      this.viewModel.getSelectedElementCurrentState().style[type] = null;
    },

    /// modify container object

    onUpdateBGColor({ item, color }) {
      item.backgroundColor = color;
    },
    onUpdateTypographyColor({ item, color }) {
      console.log(item, color);
      this.$nextTick(() => {
        item.color = color;
      });
    },
    onUpdateTypographyFontsize({ item, size }) {
      this.$nextTick(() => {
        item.fontSize = size;
      });
    },
    onUpdateTypographyFontfamily({ item, family }) {
      this.$nextTick(() => {
        item.fontFamily = family;
      });
    },
  },
};
</script>

<style scoped></style>
