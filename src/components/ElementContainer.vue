<template>
  <div
    :container="container"
    class="container"
    :class="{
      'container--selected': container.isSelected,
      'container--hovered': container.isHovered,
    }"
    :border="
      container.isSelected || container.isHovered
        ? `${container.borderWidth}px solid ${container.borderColor}`
        : '2px solid transparent'
    "
    :style="{
      backgroundColor: container.backgroundColor,

      backgroundImage: `url(${container.BGImage})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
    }"
    @click.stop="selectItem(container)"
    @mouseover="handleItemHover(container)"
    @dragover.stop.prevent="handleItemHover(container)"
    @mouseleave="handleContainerDehover"
    @drop="handleWidgetDrop(container)"
  >
    <div class="name" v-if="container.isSelected">
      {{ container.containerName }}
    </div>
    <div class="child" v-if="container.children && container.children.length">
      <div
        class="child-item"
        :class="{
          'child-item--selected': child.isSelected,
          'child-item--hovered': child.isHovered,
        }"
        v-for="(child, index) in container.children"
        :key="child"
        :data-key="index"
        @click.stop="selectItem(child)"
        @contextmenu.prevent="onContextMenu($event, 'child', child)"
        @mouseover.stop="handleItemHover(child)"
      >
        <ElementLeaf style="padding: 4px" :child="child" :type="child.type" />
      </div>
      <div
        class="widget-dropzone"
        v-show="container.isWidgetDropzoneShown && container.isHovered"
      ></div>
    </div>
  </div>
</template>

<script>
import ElementLeaf from "./ElementLeaf.vue";

export default {
  props: {
    container: {
      type: Object,
      required: true,
    },
  },
  emits: ["select-item", "item-hover", "widget-drop"],
  methods: {
    selectItem(item) {
      this.$emit("select-item", item);
    },
    handleItemHover(item) {
      this.$emit("item-hover", item);
    },
    handleWidgetDrop(container) {
      this.$emit("widget-drop", container);
    },
    onContextMenu(event, type, item) {
      event.preventDefault();
      this.$emit("context-menu", event, type, item);
      this.$emit("select-item", item); // Add this line
    },
  },

  components: {
    ElementLeaf: ElementLeaf,
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
