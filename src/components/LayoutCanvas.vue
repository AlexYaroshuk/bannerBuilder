<template>
  <div class="layout-canvas" ref="layoutcanvas">
    <div
      v-if="containers.length === 0"
      style="text-align: center; color: white"
    >
      <h1>
        ¯\_(ツ)_/¯
        <br />
        Well, nothing here.
      </h1>
      <br />➡️ Add something from Assets to get started.
    </div>

    <div
      @dragover.stop.prevent="updateHoverIndex(index)"
      @drop="handleContainerDrop($event, index)"
      class="dropzone"
      :class="{
        'dropzone--hovered': dropzoneHovered,
      }"
      v-show="
        (this.viewModel.isDraggingExistingElement ||
          this.viewModel.isDraggingAssetsElement) &&
        containers.length <= 1
      "
    >
      <i class="material-icons">add_circle_outline</i>
    </div>
    <div
      v-for="(container, index) in containers"
      :key="index"
      @dragstart="
        handleDragStart({ item, index, type: 'container' }, $event, 'main')
      "
      @drag="updateFloatingContainerPosition"
      @dragend="handleDragEnd"
    >
      <div
        @dragover.stop.prevent="updateHoverIndex(index)"
        @drop="handleContainerDrop($event, index)"
        class="dropzone"
        :class="{
          'dropzone--hovered': dropzoneHovered(index),
        }"
        v-show="
          (this.viewModel.isDraggingExistingElement ||
            this.viewModel.isDraggingAssetsElement) &&
          containers.length > 1 &&
          this.viewModel.draggedContainerIndex !== index
        "
      >
        <i class="material-icons">add_circle_outline</i>
      </div>

      <ElementContainer
        :viewModel="this.viewModel"
        :draggable="containers.length > 1"
        :container="container"
        @contextmenu.prevent="
          showContextMenu($event, container), selectItem(container)
        "
        @onContextMenu="
          ($event, child) => {
            showContextMenu($event, child);
            selectItem(child);
          }
        "
        @item-hover="hoverItem"
        @widget-drop="handleWidgetDrop"
        @select-item="selectItem"
      />
    </div>
    <div
      @dragover.stop.prevent="updateHoverIndex(containers.length)"
      @drop="handleContainerDrop($event, containers.length)"
      class="dropzone"
      :class="{
        'dropzone--hovered': dropzoneHovered(containers.length),
      }"
      v-show="
        (this.viewModel.isDraggingExistingElement ||
          this.viewModel.isDraggingAssetsElement) &&
        containers.length > 0
      "
    >
      <i class="material-icons">add_circle_outline</i>
    </div>
  </div>
  <div
    class="context-menu"
    :style="{
      top: contextMenu.top,
      left: contextMenu.left,
      display: contextMenu.isVisible ? 'block' : 'none',
    }"
  >
    <div class="context-menu-row" @click="handleDeleteContainer">
      <span class="action">Delete</span>
      <span class="hotkey">Ctrl+D</span>
    </div>
  </div>
</template>
<script>
import ElementContainer from "./ElementContainer.vue";
import { BannerBuilderViewModel } from "../viewmodels/bannerBuilderViewModel";

export default {
  components: {
    ElementContainer: ElementContainer,
  },
  emits: [
    "addNewContainer",
    "container-drop",
    "delete-container",
    "delete-key-press",
    "handleClickOutside",
    "handleContainerDrop",
    "handleDeleteContainer",
    "handleDeleteKeyPress",

    "handleWidgetDrop",

    "showContextMenu",

    "updateHoverIndex",
    "widget-drop",
  ],
  props: {
    viewModel: {
      type: BannerBuilderViewModel,
      default: null,
    },

    containers: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      hoverIndex: null,

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
        (this.viewModel.isDraggingExistingElement ||
          this.viewModel.isDraggingAssetsElement) &&
        this.viewModel.hoverIndex === index;
    },
  },

  mounted() {
    /* document.addEventListener("click", this.handleClickOutside); */
    window.addEventListener("keydown", this.handleDeleteKeyPress);
  },

  beforeUnmount() {
    /* document.removeEventListener("click", this.handleClickOutside); */
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
    handleDeleteContainer() {
      this.$emit("delete-container");
      this.contextMenu.isVisible = false;
    },
    handleDeleteKeyPress(event) {
      if (event.key === "Delete") {
        this.$emit("delete-container");
        this.contextMenu.isVisible = false;
      }
    },

    /* handleClickOutside() {
      if (this.contextMenu.isVisible) {
        this.contextMenu.isVisible = false;
      }
    }, */

    updateHoverIndex(index) {
      /* viewModel.updateHoverIndex(index, this.$emit); */

      if (
        this.viewModel.isDraggingExistingElement ||
        this.viewModel.isDraggingAssetsElement
      ) {
        if (
          this.viewModel.dragSource === "main" &&
          this.viewModel.draggedElement.containerIndex < index
        ) {
          index--;
        }
        this.viewModel.hoverIndex = index;
      } else {
        this.viewModel.hoverIndex = null;
      }
    },

    //
    ///select, hover
    selectItem(item) {
      this.$emit("select-item", item);
    },

    hoverItem(item) {
      this.$emit("hover-item", item);
    },

    /*     selectItem(item) {
      this.viewModel.selectItem(item);
    },

    hoverItem(item) {
      this.viewModel.hoverItem(item);
    }, */

    //
    /// drag
    handleDragStart({ item, index, type, containerIndex }, event, source) {
      this.viewModel.existingElementDragStart(
        { item, index, type, containerIndex },
        event,
        source,
        this.$emit
      );

      if (event && event.dataTransfer) {
        event.dataTransfer.setData("text/plain", ""); // for Firefox compatibility
      }

      let containerElement;

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
    onElementDragStart(event, item, index, type, containerIndex, source) {
      this.viewModel.existingElementDragStart(
        { item, index, type, containerIndex },
        event,
        source,
        this.$emit
      );
    },

    handleDragEnd() {
      this.viewModel.handleDragEnd();
      this.hoverIndex = null;
      /* this.dragSource = null;
      this.draggedContainerIndex = null; */

      if (this.floatingContainer) {
        this.floatingContainer.remove();
        this.floatingContainer = null;
      }

      const containerElements =
        this.$refs.layoutcanvas.querySelectorAll(".container");
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

    handleContainerDrop(event, containerIndex) {
      this.$emit("handleContainerDrop", {
        event,
        containerIndex,

        draggedContainerIndex: this.viewModel.draggedContainerIndex,
      });
      this.viewModel.handleDragEnd();
    },

    handleWidgetDrop(container) {
      this.$emit("handleWidgetDrop", {
        container,
        widget: this.viewModel.draggedElement,
      });
      this.viewModel.handleDragEnd();
    },

    handleTreeDrop({ item, index, type, containerIndex }) {
      if (!this.draggedElement) return;

      const from = this.draggedElement;

      // Handle container drag and drop
      if (from.type === "container" && type === "container") {
        this.$emit("moveExistingContainer", {
          targetIndex: index,
          fromTree: true,
          draggedContainerIndex: this.draggedContainerIndex,
        });
      }
      // Handle child drag and drop within the same container
      else if (
        from.type === "child" &&
        type === "child" &&
        from.containerIndex === containerIndex
      ) {
        this.$emit("moveChildWithinContainer", {
          from: from,
          targetIndex: index,
          containerIndex: containerIndex,
        });
      }
      // Handle child drag and drop between different containers
      else if (
        from.type === "child" &&
        type === "child" &&
        from.containerIndex !== containerIndex
      ) {
        this.$emit("moveChildBetweenContainers", {
          from: from,
          targetIndex: index,
          targetContainerIndex: containerIndex,
        });
      }
      // Handle child drag and drop onto container
      else if (from.type === "child" && type === "container") {
        this.$emit("moveChildToContainer", {
          from: from,
          targetContainer: item,
        });
      }
    },
  },
};
</script>
<style scoped></style>
