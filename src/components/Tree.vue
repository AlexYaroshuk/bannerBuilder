<template>
  <div v-if="containers.length === 0">
    <h3>No layers</h3>
    <br />
    When you add a component, you'll see it here.
  </div>
  <div
    v-for="(container, index) in containers"
    :key="'container-' + index"
    class="tree-item-wrapper"
    @mouseleave="handleDehover"
  >
    <div
      v-if="
        dragging && draggedItemType === 'container' && dropIndicator === index
      "
      class="drop-indicator"
      :style="dropIndicatorStyles"
    ></div>
    <li
      class="tree-item"
      :class="{
        'tree-item--selected': container.isSelected,
        'tree-item--hovered': container.isHovered,
      }"
      draggable="true"
      @click.stop="selectItem(container)"
      @mouseover="handleItemHover(container)"
      @dragstart="handleDragStart(container, index, 'container')"
      @dragover.prevent="handleDragOver($event, container, index, 'container')"
      @drop="handleDrop(container, index, 'container')"
    >
      <span class="tree-item__icon-wrapper">
        <span class="material-icons">check_box_outline_blank</span>
      </span>
      {{ container.containerName }}
    </li>
    <div v-if="container.children">
      <li
        v-for="(child, childIndex) in container.children"
        :key="'child-' + childIndex"
        class="tree-item"
        :class="{
          'tree-item--selected': child.isSelected,
          'tree-item--hovered': child.isHovered,
          [childSelectedClass(container)]: true,
        }"
        draggable="true"
        @click.stop="selectItem(child)"
        @mouseover="handleItemHover(child)"
        @dragstart="handleDragStart(child, childIndex, 'child', index)"
        @dragover.prevent="
          handleDragOver($event, child, childIndex, 'child', index)
        "
        @drop="handleDrop(child, childIndex, 'child', index)"
      >
        <div
          v-if="
            dragging &&
            draggedItemType === 'child' &&
            dropIndicator === childIndex &&
            hoveredContainerIndex === index
          "
          class="drop-indicator"
          :style="dropIndicatorStyles"
        ></div>
        <span class="tree-item__icon-wrapper" style="padding-left: 1rem">
          <span class="material-icons">text_format</span>
        </span>
        {{ child.value }}
      </li>
      <div
        v-if="isLastChildHovered(index)"
        class="drop-indicator"
        :style="dropIndicatorStyles"
      ></div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    containers: {
      type: Array,
      default: () => [],
    },

    selectedItem: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      dragging: false,
      draggedItemType: null,
      dropIndicator: null,
      hoveredContainerIndex: null,
      hoveredElementPosition: null,
      containerElementPosition: null,
      topPosition: null,
    };
  },

  methods: {
    selectItem(item) {
      this.$emit("select-item", item);
    },

    handleItemHover(item) {
      this.$emit("item-hover", item);
    },
    handleDragStart(item, index, type, containerIndex = null) {
      this.$emit("drag-start", { item, index, type, containerIndex });
      this.dragging = true;
      this.draggedItemType = type;

      if (type === "child") {
        this.draggedItem = { item, containerIndex };
      } else {
        this.draggedItem = { item };
      }

      // Set a custom drag image to ensure that only one element is being dragged at a time
      const dragImage = new Image();
      dragImage.src =
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'/%3E";
      event.dataTransfer.setDragImage(dragImage, 0, 0);
    },

    handleDragOver(event, item, index, type, containerIndex = null) {
      event.preventDefault();
      if (!this.dragging) return;

      const element = event.target.closest(".tree-item");
      const rect = element.getBoundingClientRect();
      const middleY = rect.top + rect.height / 2;
      const topPosition =
        rect.top -
        element.closest(".tree-item-wrapper").getBoundingClientRect().top;

      if (event.clientY < middleY) {
        this.dropIndicator = index;
        this.topPosition = topPosition;
      } else {
        this.dropIndicator = index + 1;
        this.topPosition = topPosition + rect.height;
      }

      this.topPosition = topPosition;

      if (type === "child") {
        this.hoveredContainerIndex = containerIndex;
        const containerElement = element.closest(".tree-item-wrapper");
        this.containerElementPosition =
          containerElement.getBoundingClientRect().top;
      } else {
        this.hoveredContainerIndex = null;
        this.containerElementPosition = null;
        element.classList.add("tree-item--hovered"); // add class to container list item
      }
    },

    handleDrop(item, index, type, containerIndex = null) {
      this.dragging = false;
      this.draggedItemType = null;
      this.dropIndicator = null;
      this.hoveredElementPosition = null;
      this.containerElementPosition = null;

      if (type === "container" && containerIndex !== null) {
        return;
      }

      if (
        this.draggedItemType === "child" &&
        this.hoveredContainer &&
        this.hoveredItem === this.hoveredContainer
      ) {
        this.$emit("drop", {
          item: this.draggedItem.item,
          type,
          containerIndex,
        });
      } else {
        this.$emit("drop", { item, index, type, containerIndex });
      }
    },
    handleDehover() {
      this.$emit("dehover");
    },
  },
  computed: {
    ddropIndicatorStyles() {
      if (this.dropIndicator === null || this.topPosition === null) {
        return {};
      }

      return {
        top: `${this.topPosition}px`,
      };
    },

    isLastChildHovered() {
      return (containerIndex) => {
        if (!this.dragging || this.draggedItemType !== "child") return false;
        const lastChildIndex =
          this.containers[containerIndex].children.length - 1;
        return (
          this.dropIndicator === lastChildIndex + 1 &&
          this.hoveredContainerIndex === containerIndex
        );
      };
    },
    childSelectedClass() {
      return (container) => {
        return container.isSelected ? "tree-item--child-selected" : "";
      };
    },
  },
};
</script>

<style scoped>
.tree-item {
  display: flex;
  align-items: center;
  padding: 4px;
  color: #555;
  border: 2px solid transparent;
  font-size: small;
  position: relative;
}

.tree-item__icon-wrapper {
  display: flex;
  align-items: center;
  margin-right: 5px;
}

.tree-item--selected {
  background-color: hsla(212, 100%, 75%, 0.4);
}

.tree-item--child-selected {
  background-color: hsla(212, 100%, 75%, 0.2);
}

.tree-item--hovered {
  border: 2px solid hsl(212, 100%, 54%);
}

.tree-item:not(.selected):hover {
  border: 2px solid hsl(212, 100%, 54%);
}

.elements-container {
  padding: 10px;
  display: flex;
  justify-content: center;
}

.tree-item-wrapper {
  position: relative;
}

.tree-item-insert-indicator {
  display: block;
  width: 100%;
  height: 2px;
  background-color: #4caf50;
}

.drop-indicator {
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #4285f4;
  z-index: 10;
  top: 0;
}
</style>
