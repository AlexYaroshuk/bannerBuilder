<template>
  <aside :class="['sidebar-button', { hidden: !isVisible }]">
    <button @click="toggleVisibility">&gt; Show sidebar</button>
  </aside>
  <aside :class="['sidebar', { hidden: !isVisible }]" :containers="containers">
    <button @click="toggleVisibility">&lt; Hide</button>
    <div class="tab-bar">
      <button
        class="tab"
        :class="{ active: activeTab === 'layers' }"
        @click="activateTab('layers')"
      >
        <i class="material-icons">layers</i>
        <span>Layers</span>
        <span
          class="ripple"
          v-if="activeTab === 'layers'"
          :style="rippleStyle"
        ></span>
      </button>
      <button
        class="tab"
        :class="{ active: activeTab === 'elements' }"
        @click="activateTab('elements')"
      >
        <i class="material-icons">view_module</i>
        <span>Elements</span>
        <span
          class="ripple"
          v-if="activeTab === 'elements'"
          :style="rippleStyle"
        ></span>
      </button>
      <button
        class="tab"
        :class="{ active: activeTab === 'assets' }"
        @click="activateTab('assets')"
      >
        <i class="material-icons">folder_open</i>
        <span>Assets</span>
        <span
          class="ripple"
          v-if="activeTab === 'assets'"
          :style="rippleStyle"
        ></span>
      </button>
      <div
        class="active-underline"
        :style="{ transform: underlineTransform }"
      ></div>
    </div>

    <div
      v-for="(container, index) in containers"
      :key="index"
      v-if="activeTab === 'layers'"
    >
      <li
        class="tree-item"
        :class="{
          'tree-item--selected': container.isSelected,
          'tree-item--hovered': container.isHovered,
        }"
        @click="selectContainer(container)"
        @mouseover="handleContainerHover"
      >
        {{ container.containerName }}
      </li>
      <ul v-if="container.children">
        <li
          v-for="(child, index) in container.children"
          :key="index"
          class="tree-item"
          :class="{
            'tree-item--selected': child.isSelected,
            'tree-item--hovered': child.isHovered,
          }"
          @click="selectChild(child)"
        >
          {{ child.value }}
        </li>
      </ul>
    </div>
    <div v-if="activeTab === 'elements'"></div>
    <div v-if="activeTab === 'assets'">
      <!-- Asset component goes here -->
    </div>
  </aside>
</template>
<script>
export default {
  props: {
    containers: {
      type: Array,
      default: () => [],
    },
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
      activeTab: "layers",
      tabLabels: ["Layers", "Elements", "Assets"],
      rippleActive: false,
    };
  },

  methods: {
    //control
    toggleVisibility() {
      this.isVisible = !this.isVisible;
    },

    activateTab(tab) {
      this.activeTab = tab;
    },
    //emits
    selectChild(child, childIndex) {
      this.$emit("select-child", { child, childIndex });
    },
    selectContainer(container) {
      this.$emit("select-container", { container });
    },

    handleContainerHover() {
      this.$emit("container-hover", this.container);
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

    //extra
    startRipple(event) {
      const button = event.currentTarget;
      const ripple = button.querySelector(".ripple");
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.transform = "scale(0)";
      this.rippleActive = true;
      setTimeout(() => {
        this.rippleActive = false;
      }, 500);
    },
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
  border: 2px solid transparent;
  /*   border-left: 2px solid transparent;
  border-right: 2px solid transparent;
  border-top: 2px solid transparent;
  border-bottom: 2px solid lightgrey; */
}

.tree-item--selected {
  background-color: #1280ff;
  color: white;
}

.tree-item--hovered {
  border: 2px solid #1280ff;
}

.tree-item:not(.selected):hover {
  border: 2px solid #1280ff;
}

.tab-bar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 48px;
  margin-bottom: 1rem;
}

.tab-bar button {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
  width: calc(100% / 3);
  color: #555;
  background-color: white;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: background-color 0.2s ease;
}

.tab-bar button span {
  margin: 0 1rem;
}

.tab-bar button.active {
  color: white;
  background-color: #1280ff;
  border-color: #1280ff;
}

.tab-bar button .ripple {
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  background-color: rgba(0, 0, 0, 0.2);
  animation: ripple 0.5s linear;
  pointer-events: none;
}

@keyframes ripple {
  to {
    transform: scale(3);
    opacity: 0;
  }
}
</style>
