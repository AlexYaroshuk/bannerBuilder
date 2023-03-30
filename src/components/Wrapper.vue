<template>
  <div class="wrapper" ref="wrapper">
    <LayoutCanvas
      :containers="containers"
      :dragged-container-index="draggedContainerIndex"
      :isDraggingAssetsElement="isDraggingAssetsElement"
      @addNewContainer="addNewContainer"
      @element-drag-start-called="onLayoutCanvasElementDragStart"
      @delete-container="deleteContainer"
      @handleContainerDrop="handleContainerDrop($event)"
      @updateDraggedElement="updateDraggedElement"
      @select-item="selectItem"
      @hover-item="hoverItem"
      ref="layoutcanvas"
    />
    <Properties
      :selectedChild="selectedChild"
      :selectedContainer="selectedContainer"
      @clear-image-BG="onClearBGImage"
      @clear-image-nested="onClearNestedImage"
      @link-bg-color-changed="onLinkBGColorChanged"
      @link-color-changed="onLinkColorChanged"
      @link-font-family-changed="onLinkFontChanged"
      @link-font-size-changed="onLinkSizeChanged"
      @set-bg-color="onUpdateBGColor"
      @set-border-color="onUpdateBorderColor"
      @set-border-radius="onUpdateBorderRadius"
      @set-border-width="onUpdateBorderWidth"
      @set-link-label="onBannerLinkLabelUpdate"
      @set-link-URL="onBannerURLUpdate"
      @set-text="onBannerTextUpdate"
      @text-bg-color-changed="onTextBGChanged"
      @text-color-changed="onTextColorChanged"
      @text-font-family-changed="onTextFamilyChanged"
      @text-font-size-changed="onTextSizeChanged"
      @update-image-BG="onUpdateBGImage"
      @update-image-nested="onUpdateNestedImage"
      ref="properties"
    />

    <LeftSidebar
      :containers="containers"
      :selected-item="selectedChild"
      @contextmenu="showContextMenu"
      @dehover="dehoverAll"
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
      @element-drag-start="
        handleDragStart(
          { item: $event.item, index: $event.index, type: $event.type },
          $event.event,
          'assets'
        )
      "
      @drop="handleTreeDrop"
      @element-drag-end="handleDragEnd"
      @hover-item="hoverItem"
      @select-item="selectItem"
      @tree-dehover="dehoverAll"
      ref="tree"
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
    <div class="context-menu-row" @click="deleteContainer">
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
import newContainerMixin from "../mixins/newContainerMixin";
import appsetup from "../mixins/app-setup";

export default {
  components: {
    ElementContainer,
    Properties,
    LeftSidebar,
    LayoutCanvas,
  },

  mixins: [appsetup, newContainerMixin],

  data() {
    const { containers } = appsetup.setup();
    return {
      containers,
      //selection
      selectedContainer: null,
      selectedChild: null,

      //dragging
      draggedElement: null,
      floatingContainer: null,
      isDraggingExistingElement: false,
      isDraggingAssetsElement: false,
      dragSource: null,

      hoverIndex: null,
      draggedContainerIndex: null,
      originalContainerIndex: null,

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
    window.addEventListener("keydown", this.handleDeleteKeyPress);
    document.addEventListener("click", this.handleClickOutside);
  },

  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
    window.removeEventListener("keydown", this.handleDeleteKeyPress);
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
      const tree = this.$refs.tree;
      const properties = this.$refs.properties;

      if (
        this.contextMenu.isVisible &&
        !event.target.closest(".context-menu") &&
        wrapper.contains(event.target)
      ) {
        this.contextMenu.isVisible = false;
      }

      // Check if the click event is not inside Tree or Properties components
      if (
        !tree.$el.contains(event.target) &&
        !properties.$el.contains(event.target)
      ) {
        this.deselectAll();
        this.dehoverAll();
      }
    },

    handleDeleteKeyPress(event) {
      if (event.key === "Delete") {
        this.deleteContainer();
      }
    },

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
      this.containers.forEach((container) => {
        container.isSelected = false;
        if (container.children) {
          container.children.forEach((child) => {
            child.isSelected = false;
          });
        }
      });
      this.selectedContainer = null;
      this.selectedChild = null;
    },

    dehoverAll() {
      this.containers.forEach((container) => {
        container.isHovered = false;
        if (container.children) {
          container.children.forEach((child) => {
            child.isHovered = false;
          });
        }
      });
    },

    selectItem(item) {
      if (this.contextMenu.container !== item) {
        this.contextMenu.isVisible = false;
      }

      this.deselectAll();
      item.isSelected = true;

      if (item.type === "container") {
        this.selectedContainer = item;
      } else {
        this.selectedChild = item;
      }
    },

    hoverItem(item) {
      this.dehoverAll();

      item.isHovered = true;
    },

    //
    /// drag
    updateDraggedElement(draggedElement) {
      this.draggedElement = draggedElement;
    },
    handleDragStart({ item, index, type, containerIndex }, event, source) {
      this.isDraggingExistingElement = source !== "assets";
      this.isDraggingAssetsElement = source === "assets";

      let containerElement;
      this.dragSource = source;

      this.draggedContainerIndex = index;
      this.originalContainerIndex = index;

      this.draggedElement = { item, index, type, containerIndex };

      if (event && event.dataTransfer) {
        event.dataTransfer.setData("text/plain", ""); // for Firefox compatibility
      }

      if (source === "main") {
        // Remove the dragged container
        containerElement = event.target.closest(".container");
      }

      if (!containerElement) return;

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
    },

    handleDragEnd() {
      this.draggedElement = null;
      this.isDraggingExistingElement = false;
      this.isDraggingAssetsElement = false;
      this.hoverIndex = null;
      this.dragSource = null;
      this.draggedContainerIndex = null;

      if (this.floatingContainer) {
        this.floatingContainer.remove();
        this.floatingContainer = null;
      }

      const containerElements =
        this.$refs.wrapper.querySelectorAll(".container");
      containerElements.forEach((containerElement) => {
        containerElement.style.display = "";
      });
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
      dragSource,
      draggedContainerIndex,
    }) {
      event.preventDefault();
      if (!this.draggedElement) return;

      if (dragSource === "assets") {
        this.addNewContainer(containerIndex);
      } else {
        this.moveExistingContainer(containerIndex, draggedContainerIndex);
      }

      this.originalContainerIndex = null;
    },
    handleTreeDrop({ item, index, type, containerIndex }) {
      if (!this.draggedElement) return;

      const from = this.draggedElement;

      // Handle container drag and drop
      if (from.type === "container" && type === "container") {
        this.moveExistingContainer(index, true);
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
    /// modify containers array

    deleteContainer() {
      this.containers = this.containers.filter(
        (container) => !container.isSelected
      );
      this.contextMenu.isVisible = false;
    },

    // Data mutation methods
    addNewContainer(containerIndex) {
      const newContainer = this.createNewContainer();
      this.containers.splice(containerIndex, 0, newContainer);
    },

    moveExistingContainer(
      targetIndex,
      draggedContainerIndex,
      fromTree = false
    ) {
      // const draggedContainer = this.containers.splice(draggedContainerIndex, 1)[0];
      draggedContainerIndex = this.draggedContainerIndex;
      [this.containers[targetIndex], this.containers[draggedContainerIndex]] = [this.containers[draggedContainerIndex], this.containers[targetIndex]];

      // if (!fromTree && targetIndex > this.originalContainerIndex) {
      //   targetIndex--;
      // }
      // this.containers.splice(targetIndex, 0, draggedContainer);
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

    onBannerTextUpdate(text, child) {
      if (!this.containers) return; // check that containers is defined
      const containerIndex = this.containers.findIndex((container) =>
        container.children.includes(child)
      );
      if (containerIndex !== -1) {
        const container = this.containers[containerIndex];
        const childIndex = container.children.indexOf(child);

        // Create a new object with the updated value
        const updatedChild = { ...child, value: text };

        // Update the child object in the container
        container.children.splice(childIndex, 1, updatedChild);

        // Check if the updated child is currently selected
        if (this.selectedChild === child) {
          // Update the selectedChild object in the component
          this.selectedChild = updatedChild;
        }
      }
    },

    /// modify container object

    onUpdateBGColor({ container, color }) {
      if (color === null) {
        container.backgroundColor = this.defaultColors[container.index];
      } else {
        container.backgroundColor = color;
      }
    },
  },
};
</script>

<style scoped></style>
