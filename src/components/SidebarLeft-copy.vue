<template>
  <div v-for="(treeItem, index) in treeItems" :key="index">
    <li
      class="tree-item"
      :class="{ 'tree-item--selected': treeItem.isSelected }"
      @click="selectContainer(treeItem)"
    >
      {{ treeItem.containerName }}
    </li>
    <ul v-if="treeItem.children">
      <li
        v-for="(child, childIndex) in treeItem.children"
        :key="childIndex"
        class="tree-item"
        :class="{ 'tree-item--selected': child.isSelected }"
        @click="selectChild(treeItem, child)"
      >
        {{ child.value }}
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    treeItems: {
      type: Array,
      default: () => [],
    },
    selectedItem: {
      type: Object,
      default: null,
    },
  },
  watch: {
    selectedItem() {
      this.updateSelection();
    },
  },
  methods: {
    selectChild(parent, child) {
      this.$emit("select", { parent, child });
    },
    selectContainer(container) {
      this.$emit("select", { container, child: null });
    },
    updateSelection() {
      this.treeItems.forEach((item) => {
        item.isSelected = item === this.selectedItem.container;
        if (item.children) {
          item.children.forEach((c) => {
            c.isSelected = c === this.selectedItem.child;
          });
        }
      });
    },
  },
};
</script>

<style scoped>
.tree-item {
  list-style: none;
  width: 100%;
  padding: 8px;
  border: 2px transparent #1280ff;
  /*   border-left: 2px solid transparent;
  border-right: 2px solid transparent;
  border-top: 2px solid transparent;
  border-bottom: 2px solid lightgrey; */
}

.tree-item--selected {
  background-color: #1280ff;
  color: white;
}

.tree-item:not(.selected):hover {
  border: 2px solid #1280ff;
}
</style>
