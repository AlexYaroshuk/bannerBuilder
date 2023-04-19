<template>
  <div
    :container="container"
    class="container"
    :class="{
      'container--selected': viewModel.getSelectedElement() === container,
      'container--hovered': viewModel.getHoveredElement() === container,
    }"
    :border="
      viewModel.getSelectedElement() === container ||
      viewModel.getHoveredElement() === container
        ? `${container.borderWidth}px solid ${container.borderColor}`
        : '2px solid transparent'
    "
    :style="{ ...containerStyle, ...borderColorStyle }"
    @click.stop="selectItem(container)"
    @mouseover="hoverItem(container)"
    @dragover.stop.prevent="hoverItem(container)"
    @mouseleave="handleContainerDehover"
    @drop="handleWidgetDrop(container)"
  >
    <div class="name" v-if="viewModel.getSelectedElement() === container">
      {{ container.name }}
    </div>
    <div class="child" v-if="container.children && container.children.length">
      <div
        class="child-item"
        :class="{
          'child-item--selected': viewModel.getSelectedElement() === child,
          'child-item--hovered': viewModel.getHoveredElement() === child,
        }"
        v-for="(child, index) in container.children"
        :key="index"
        :data-key="index"
        @click.stop="selectItem(child)"
        @contextmenu.prevent="onContextMenu($event, 'child', child)"
        @mouseover.stop="hoverItem(child)"
      >
        <ElementText
          v-if="child && child.type === 'text'"
          style="padding: 4px"
          :child="child"
        />

        <ElementLink
          v-if="child && child.type === 'link'"
          style="padding: 4px"
          :child="child"
        />

        <ElementContainer
          v-if="child && child.type === 'container'"
          style="padding: 4px"
          :container="child"
          :viewModel="viewModel"
        />
      </div>
      <div
        class="widget-dropzone"
        v-show="
          viewModel.isDraggingWidgetElement &&
          viewModel.getHoveredElement() === container
        "
      ></div>
    </div>
  </div>
</template>

<script>
import ElementText from "./ElementText.vue";
import ElementLink from "./ElementLink.vue";
import { Container } from "@/models/container";
import { BannerBuilderViewModel } from "@/viewmodels/bannerBuilderViewModel";

const ElementContainer = {
  props: {
    viewModel: {
      type: BannerBuilderViewModel,
      default: true,
    },
    container: {
      type: Container,
      required: true,
    },
  },
  emits: ["widget-drop"],
  methods: {
    selectItem(item) {
      this.viewModel.selectItem(item);
    },
    hoverItem(item) {
      this.viewModel.hoverItem(item);
    },
    handleWidgetDrop(container) {
      if (
        !this.viewModel.draggedElement ||
        this.viewModel.draggedElement.type === "container"
      )
        return;
      this.$emit("widget-drop", container);
    },
    onContextMenu(event, type, item) {
      event.preventDefault();
      this.$emit("context-menu", event, type, item);
      this.$emit("select-item", item);
    },
  },
  computed: {
    containerStyle() {
      const styles = this.container.getEffectiveStyles();
      return {
        backgroundColor: styles.backgroundColor,
        backgroundImage: styles.backgroundImage,
        backgroundRepeat: styles.backgroundRepeat,
        backgroundPosition: styles.backgroundPosition,
        backgroundSize: styles.backgroundSize,
      };
    },
    borderColorStyle() {
      const isSelectedOrHovered =
        this.viewModel.selectedItem === this.container ||
        this.viewModel.hoveredItem === this.container;
      return {
        border: isSelectedOrHovered
          ? `${this.container.borderWidth}px solid ${this.container.borderColor}`
          : "2px solid transparent",
      };
    },
  },
};

export default {
  components: {
    ElementText: ElementText,
    ElementLink: ElementLink,
    ElementContainer: ElementContainer,
  },

  props: {
    viewModel: {
      type: Object,
      default: () => ({}),
    },
    container: {
      type: Object,
      required: true,
    },
  },
  emits: ["widget-drop"],

  beforeCreate() {
    this.$options.components.ElementContainer = this.$options;
  },

  methods: {
    selectItem(item) {
      this.viewModel.handleElementSelected(item);
    },
    hoverItem(item) {
      this.viewModel.handleElementHovered(item);
    },
    handleWidgetDrop(container) {
      if (
        !this.viewModel.draggedElement ||
        this.viewModel.draggedElement.type === "container"
      )
        return;
      this.$emit("widget-drop", container);
    },
    onContextMenu(event, type, item) {
      event.preventDefault();
      this.$emit("context-menu", event, type, item);
      this.$emit("select-item", item); // Add this line
    },
  },
  computed: {
    containerStyle() {
      const styles = this.container.getEffectiveStyles();
      return {
        backgroundColor: styles.backgroundColor,
        backgroundImage: styles.backgroundImage,
        backgroundRepeat: styles.backgroundRepeat,
        backgroundPosition: styles.backgroundPosition,
        backgroundSize: styles.backgroundSize,
      };
    },
    borderColorStyle() {
      const isSelectedOrHovered =
        this.viewModel.getSelectedElement() === this.container ||
        this.viewModel.getHoveredElement() === this.container;
      return {
        border: isSelectedOrHovered
          ? `${this.container.borderWidth}px solid ${this.container.borderColor}`
          : "2px solid transparent",
      };
    },
  },
};
</script>

<style scoped>
.container {
  flex-direction: column;
  width: 520px;
  height: 96px;
  display: flex;
  justify-content: space-between;
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid transparent;
  min-width: 8px;
  min-height: 8px;
}
.container[data-has-image="true"] {
  background-image: url(BGImage);
}
.container--selected {
  border: 2px solid #1280ff;
}
.container--hovered {
  border: 2px solid #1482ff80;
}
.container--selected .name {
  position: absolute;
  top: 0;
  left: 0;
  font-size: smaller;
  background-color: #1280ff;
  color: white;
  padding: 0px 4px;
}
.child {
  display: flex;
  align-items: center;
  padding: 16px;
  flex: 1;
}
.child-item {
  position: relative;
  display: flex;
  z-index: 1;
  border: 2px solid transparent;
}
.child-item--hovered {
  border: 2px solid #1482ff80;
}
.child-item--selected {
  border: 2px solid #1482ff;
}
.container--dragging {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06);
  cursor: grabbing;
}

.floating-container {
  position: fixed;
  pointer-events: none;
  z-index: 5;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06);
  opacity: 0.9;
}
.widget-dropzone {
  min-width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  border: 2px solid #1482ff80;
  transition: min-height 0.2s ease, background-color 0.2s ease;
}

.widget-dropzone--hovered {
  min-height: 48px;
  background-color: #1280ff;
}
</style>
