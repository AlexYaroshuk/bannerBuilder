<template>
  <aside :class="['sidebar-button', { hidden: !isVisible }]">
    <button @click="toggleVisibility">&gt; Show sidebar</button>
  </aside>
  <aside :class="['sidebar', { hidden: !isVisible }]">
    <h2>Tree</h2>
    <p>This is the where you can see your components</p>
    <button @click="toggleVisibility">&lt; Hide</button>
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
  </aside>
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
  data() {
    return {
      isVisible: true,
    };
  },
  watch: {
    selectedItem() {
      this.updateSelection();
    },
  },
  methods: {
    toggleVisibility() {
      this.isVisible = !this.isVisible;
    },
    selectChild(parent, child) {
      this.$emit("select", { parent, child });
    },
    selectContainer(container) {
      this.$emit("select", { container });
    },

    /*     updateSelection() {
      this.treeItems.forEach((item) => {
        item.isSelected = item === this.selectedItem.container;
        if (item.children) {
          item.children.forEach((c) => {
            c.isSelected = c === this.selectedItem.child;
          });
        }
      });
    }, */
  },
};
</script>

<style scoped>
.sidebar {
  color: black;
  background-color: #f5f5f5;
  padding: 1rem;
  width: 20%;
  float: left;
  transition: all 0.2s ease-in-out;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
}

.hidden {
  left: -20%;
}

.sidebar-button {
  padding: 1rem;
  float: left;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
}

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
