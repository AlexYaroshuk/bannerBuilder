<template>
  <div v-if="containers.length === 0">
    <h3>No layers</h3>
    <br />
    When you add a component, you'll see it here.
  </div>
  <div v-for="(container, index) in containers" :key="index">
    <li
      class="tree-item"
      :class="{
        'tree-item--selected': container.isSelected,
        'tree-item--hovered': container.isHovered,
      }"
      @click.stop="selectItem(container)"
      @mouseover="handleItemHover(container)"
    >
      <span class="tree-item__icon-wrapper">
        <span class="material-icons">check_box_outline_blank</span>
      </span>
      {{ container.containerName }}
    </li>
    <div v-if="container.children">
      <li
        v-for="(child, index) in container.children"
        :key="index"
        class="tree-item"
        :class="{
          'tree-item--selected': child.isSelected,
          'tree-item--hovered': child.isHovered,
        }"
        @click.stop="selectItem(child)"
        @mouseover="handleItemHover(child)"
      >
        <span class="tree-item__icon-wrapper" style="padding-left: 1rem">
          <span class="material-icons">text_format</span>
        </span>
        {{ child.value }}
      </li>
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
    return {};
  },

  methods: {
    selectItem(item) {
      this.$emit("select-item", item);
    },

    handleItemHover(item) {
      this.$emit("item-hover", item);
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
}

.tree-item__icon-wrapper {
  display: flex;
  align-items: center;
  margin-right: 5px;
}

.tree-item--selected {
  background-color: #1280ff;
  color: white;
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
</style>
