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
        'dropzone--hovered': dropzoneHovered(index),
      }"
      v-show="
        (isDraggingExistingElement || isDraggingAssetsElement) &&
        dragSource != 'tree' &&
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
          (isDraggingExistingElement || isDraggingAssetsElement) &&
          dragSource != 'tree' &&
          containers.length > 1 &&
          draggedContainerIndex !== index
        "
      >
        <i class="material-icons">add_circle_outline</i>
      </div>

      <ElementContainer
        :draggable="containers.length > 1"
        :class="{
          'container--dragging':
            isDraggingExistingElement &&
            draggedElement &&
            draggedElement.index === index,
        }"
        :container="container"
        :name="container.containerName"
        @add-child="addChild"
        @container-dehover="dehoverAll"
        @contextmenu.prevent="
          showContextMenu($event, container), selectItem(container)
        "
        @deselect-all="deselectAll"
        @item-hover="hoverItem"
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
        (isDraggingExistingElement || isDraggingAssetsElement) &&
        dragSource != 'tree' &&
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
export default {
  components: {
    ElementContainer: ElementContainer,
  },
  props: {
    containers: {
      type: Array,
      default: () => [],
    },

    isDraggingAssetsElement: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      //selection
      selectedContainer: null,
      selectedChild: null,

      //dragging
      draggedElement: null,
      floatingContainer: null,
      isDraggingExistingElement: false,

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
      if (this.isDraggingAssetsElement) {
        this.dragSource = "assets";
      }

      return (index) =>
        (this.isDraggingExistingElement || this.isDraggingAssetsElement) &&
        this.hoverIndex === index;
    },
  },

  mounted() {
    document.addEventListener("click", this.handleClickOutside);
    window.addEventListener("keydown", this.handleDeleteKeyPress);
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

    handleClickOutside() {
      if (this.contextMenu.isVisible) {
        this.contextMenu.isVisible = false;
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

    selectItem(item) {
      this.$emit("select-item", item);
    },

    hoverItem(item) {
      this.$emit("hover-item", item);
    },

    //
    /// drag
    handleDragStart({ item, index, type, containerIndex }, event, source) {
      this.draggedContainerIndex = index;

      this.originalContainerIndex = index;
      if (event && event.dataTransfer) {
        event.dataTransfer.setData("text/plain", ""); // for Firefox compatibility
      }
      this.draggedElement = { item, index, type, containerIndex };
      if (type === "container") {
        this.draggedContainerIndex = index;
      } // for Firefox compatibility
      this.draggedElement = { item, index, type, containerIndex };
      if (type === "container") {
        this.draggedContainerIndex = index;
        this.originalContainerIndex = index; // Store the original index
      }

      this.draggedElement = { item, index, type, containerIndex };
      this.isDraggingExistingElement = true;
      this.dragSource = source;
      this.$emit("updateDraggedElement", this.draggedElement);
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
      this.$emit("update-floating-container", floatingContainer);

      requestAnimationFrame(() => {
        containerElement.style.display = "none";
      });
    },
    onElementDragStart(event, item, index, type, containerIndex, source) {
      this.handleDragStart(
        { item, index, type, containerIndex },
        event,
        source
      );
    },

    handleDragEnd() {
      this.draggedElement = null;
      this.isDraggingExistingElement = false;
      this.hoverIndex = null;
      this.dragSource = null;
      this.draggedContainerIndex = null;

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
        dragSource: this.dragSource,
        draggedContainerIndex: this.draggedContainerIndex,
      });
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
