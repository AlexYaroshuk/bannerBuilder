<template>
  <aside :class="['sidebar-button', { hidden: !isVisible }]">
    <button @click="toggleVisibility">&gt; Show sidebar</button>
  </aside>
  <aside @click.stop :class="['sidebar', { hidden: !isVisible }]">
    <button @click="toggleVisibility">&lt; Hide</button>
    <div class="tab-bar">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        :class="{ active: activeTab === tab.name }"
        @click="activeTab = tab.name"
        @mousedown="startRipple($event)"
      >
        <i class="material-icons"> {{ tab.icon }}</i>
        <span class="tab-text">{{ tab.label }}</span>
        <div class="ripple"></div>
      </button>

      <!-- Existing button elements -->
    </div>

    <div class="tab-content">
      <Assets
        v-if="activeTab === 'assets'"
        @element-drag-start="dragStart"
        @element-drag-end="dragEnd"
      />
      <Tree
        :containers="containers"
        :selectedItem="selectedItem"
        v-if="activeTab === 'layers'"
        @select-child="selectChild"
        @select-container="selectContainer"
      />
    </div>
  </aside>
</template>
<script>
import Tree from "./Tree.vue";
import Assets from "./Assets.vue";

export default {
  components: {
    Tree,
    Assets,
  },
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
      isVisible: true,
      activeTab: "layers",
      tabs: [
        {
          name: "layers",
          label: "Layers",
          icon: "layers",
        },
        {
          name: "assets",
          label: "Assets",
          icon: "folder",
        },
      ],
      draggableElement: null,
    };
  },
  computed: {
    indicatorTransform() {
      const index = this.tabs.findIndex((tab) => tab.name === this.activeTab);
      return `translateX(${index * 100}%)`;
    },
  },

  methods: {
    //control
    toggleVisibility() {
      this.isVisible = !this.isVisible;
    },

    activateTab(tab) {
      this.activeTab = tab;
    },

    //drag
    dragStart(event) {
      this.$emit("element-drag-start", event);
    },

    dragEnd(event) {
      this.$emit("element-drag-end", event);
    },

    //tree
    selectChild(child) {
      this.$emit("select-child", child);
    },
    selectContainer(container) {
      this.$emit("select-container", container);
    },

    handleContainerHover(container) {
      this.$emit("container-hover", container);
    },

    handleChildHover(child, container) {
      this.$emit("child-hover", child, container);
    },

    //animation
    startRipple(event) {
      const button = event.currentTarget;
      const ripple = button.querySelector(".ripple");
      const diameter = Math.max(button.clientWidth, button.clientHeight);
      const radius = diameter / 2;
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - radius;
      const y = event.clientY - rect.top - radius;
      ripple.style.width = `${diameter}px`;
      ripple.style.height = `${diameter}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.classList.add("ripple-animation");
      setTimeout(() => {
        ripple.classList.remove("ripple-animation");
      }, 300);
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
  overflow-y: scroll;
  z-index: 2;
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

.draggable-element {
  background-color: #fff;
  border: 1px solid #ddd;
  color: #333;
  cursor: grab;
  padding: 10px;
  user-select: none;
  width: 100%; /* Set a fixed width for the draggable element */
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  transition: background-color 0.2s ease; /* Center the draggable element within the container */
}
.draggable-element:hover {
  background-color: #ededed;
  /* Center the draggable element within the container */
}

.draggable-element:active {
  cursor: grabbing;
}

.draggable-element::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
}

.draggable-element:active::after {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1.8);
  transition: none;
}
</style>
