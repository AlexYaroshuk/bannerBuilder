<template>
  <aside :class="['sidebar-button', { hidden: !isVisible }]">
    <button @click="toggleVisibility">&gt; Show sidebar</button>
  </aside>
  <aside
    @click.stop
    :class="['sidebar', { hidden: !isVisible }]"
    :containers="containers"
  >
    <button @click="toggleVisibility">&lt; Hide</button>
    <div class="tab-bar">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        :class="{ active: activeTab === tab.name }"
        @click="activeTab = tab.name"
      >
        <i class="material-icons"> {{ tab.icon }}</i>
        <span class="tab-text">{{ tab.label }}</span>
        <div class="ripple"></div>
      </button>
    </div>

    <div class="tab-content">
      <div v-show="activeTab === 'assets'">
        <div class="elements-container">
          <div
            class="draggable-element"
            draggable="true"
            @dragstart="dragStart($event)"
            @dragend="dragEnd"
          >
            <i class="material-icons icon">drag_indicator</i>
            <span class="text">Drag Me</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="containers.length === 0 && activeTab === 'layers'">
      <h3>No layers</h3>
      <br />
      When you add a component, you'll see it here.
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
        @click.stop="selectContainer(container)"
        @mouseover="handleContainerHover(container)"
      >
        <span class="tree-item__icon-wrapper">
          <!-- Add this wrapper -->
          <span class="material-icons">check_box_outline_blank</span>
          <!-- Change the icon to "filter_frames" -->
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
          @click.stop="selectChild(child)"
          @mouseover.stop="handleChildHover(child, container)"
        >
          <span class="tree-item__icon-wrapper" style="padding-left: 1rem">
            <!-- Add this wrapper -->
            <span class="material-icons">text_format</span>
          </span>
          {{ child.value }}
        </li>
      </div>
    </div>

    <!-- <div v-if="activeTab === 'elements'">
      <button @click="addText">add text</button>
    </div> -->
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
        /*         {
          name: "elements",
          label: "Elements",
          icon: "widgets",
        }, */
      ],
      rippleActive: false,
      draggableElement: null,
      dragging: false,
      offsetX: 0,
      offsetY: 0,
    };
  },

  mounted() {
    window.addEventListener("mousemove", this.moveElement);
    window.addEventListener("mouseup", this.dragEnd);
  },
  beforeUnmount() {
    window.removeEventListener("mousemove", this.moveElement);
    window.removeEventListener("mouseup", this.dragEnd);
  },

  methods: {
    //control

    dragStart(event) {
      this.dragging = true;
      this.draggableElement = event.target.closest(".draggable-element");
      this.originalPosition = {
        position: this.draggableElement.style.position,
        zIndex: this.draggableElement.style.zIndex,
      };
      this.draggableElement.style.position = "absolute";
      this.draggableElement.style.zIndex = "777"; // Set a high z-index value
      this.offsetX =
        event.clientX - this.draggableElement.getBoundingClientRect().left;
      this.offsetY =
        event.clientY - this.draggableElement.getBoundingClientRect().top;

      this.$emit("element-drag-start", this.draggableElement);
    },

    dragEnd(event) {
      this.dragging = false;
      if (this.draggableElement) {
        this.draggableElement.style.position = this.originalPosition.position;
        this.draggableElement.style.zIndex = this.originalPosition.zIndex;
        this.draggableElement = null;
      }
      this.$emit("element-drag-end");
    },

    toggleVisibility() {
      this.isVisible = !this.isVisible;
    },

    activateTab(tab) {
      this.activeTab = tab;
    },
    //emits
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

    addText() {
      this.$emit("add-text"), this.selectContainer;
    },

    addChild(containerIndex, child) {
      this.containers[containerIndex].children.push(child);
    },

    addChildToContainer(containerIndex) {
      this.containers[containerIndex].children.push({
        // Child object properties
      });
    },

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
