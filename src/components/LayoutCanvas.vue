<template>
  <div class="layout-canvas" ref="layoutcanvas">
    <div
      v-if="viewModel.rootContainer.children.length === 0"
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
        viewModel.rootContainer.children.length <= 1
      "
    >
      <i class="material-icons">add_circle_outline</i>
    </div>
    <div
      @mouseleave="handleDehover"
      v-for="(container, index) in viewModel.rootContainer.children"
      :key="index"
      @dragstart="
        handleDragStart(
          { element: container, type: 'container', containerIndex: index },
          $event,
          'main'
        )
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
          viewModel.rootContainer.children.length > 1 &&
          this.viewModel.draggedContainerIndex !== index
        "
      >
        <i class="material-icons">add_circle_outline</i>
      </div>

      <ElementContainer
        :viewModel="this.viewModel"
        :draggable="viewModel.rootContainer.children.length > 1"
        :container="container"
        @contextmenu.prevent="showContextMenu($event, container)"
        @onContextMenu="
          ($event, child) => {
            showContextMenu($event, child);
            viewModel.handleElementSelected(child);
          }
        "
        @widget-drop="handleWidgetDrop(container)"
        :class="{ hidden: !container.currentState.style.isVisible }"
      />
    </div>
    <div
      @dragover.stop.prevent="
        updateHoverIndex(viewModel.rootContainer.children.length)
      "
      @drop="
        handleContainerDrop($event, viewModel.rootContainer.children.length)
      "
      class="dropzone"
      :class="{
        'dropzone--hovered': dropzoneHovered(
          viewModel.rootContainer.children.length
        ),
      }"
      v-show="
        (this.viewModel.isDraggingExistingElement ||
          this.viewModel.isDraggingAssetsElement) &&
        viewModel.rootContainer.children.length > 0
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
    <div class="context-menu-row" @click="handleDeleteElement">
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
    "delete-element",
    "delete-container",
    "delete-key-press",
    "handleClickOutside",
    "handleContainerDrop",
    "handleDeleteElement",
    "handleDeleteKeyPress",
    "handleWidgetDrop",
    "showContextMenu",
    "updateHoverIndex",
    "widget-drop",
  ],
  props: {
    viewModel: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
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
    updateHoverIndex(index) {
      /* viewModel.updateHoverIndex(index, this.$emit); */

      if (
        this.viewModel.isDraggingExistingElement ||
        this.viewModel.isDraggingAssetsElement
      ) {
        this.viewModel.hoverIndex = index;
      } else {
        this.viewModel.hoverIndex = null;
      }
      console.log("hover index", this.viewModel.hoverIndex);
    },

    showContextMenu(event, item) {
      console.log(item);
      this.viewModel.handleElementSelected(item);
      event.preventDefault();

      this.contextMenu.isVisible = true;
      this.contextMenu.top = event.clientY + "px";
      this.contextMenu.left = event.clientX + "px";
    },

    handleClickOutside() {
      this.contextMenu.isVisible = false;
    },
    handleDeleteElement() {
      this.$emit("delete-element");
      this.contextMenu.isVisible = false;
    },
    handleDeleteKeyPress(event) {
      if (event.key === "Delete") {
        this.$emit("delete-container");
        this.contextMenu.isVisible = false;
      }
    },

    handleDehover() {
      this.viewModel.dehover();
    },

    //
    /// drag
    handleDragStart({ element, type, containerIndex }, event, source) {
      console.log(type);
      this.viewModel.existingElementDragStart(
        { element, type, containerIndex },
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

    handleContainerDrop() {
      this.viewModel.dropContainer();
    },

    /// widget

    handleWidgetDrop(container) {
      this.viewModel.dropWidget(container);
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
  },
};
</script>
<style scoped>
.hidden {
  visibility: hidden;
}
</style>
