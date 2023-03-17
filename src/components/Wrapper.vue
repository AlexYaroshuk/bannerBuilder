<template>
  <div class="wrapper" ref="wrapper">
    <div
      v-if="containers.length === 0"
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
      v-if="containers.length === 0"
      class="dropzone"
      :class="{
        'dropzone--visible': dragging,
        'dropzone--hovered': dragging && hoverIndex === index - 1,
      }"
      @dragover.stop.prevent="updateHoverIndex(index - 1)"
      @drop="onDrop($event, index - 1)"
    >
      <i class="material-icons">add_circle_outline</i>
    </div>
    <div v-for="(container, index) in containers" :key="index">
      <div
        v-if="index === 0"
        class="dropzone"
        :class="{
          'dropzone--visible': dragging,
          'dropzone--hovered': dragging && hoverIndex === index - 1,
        }"
        @dragover.stop.prevent="updateHoverIndex(index - 1)"
        @drop="onDrop($event, index - 1)"
      >
        <i class="material-icons">add_circle_outline</i>
      </div>
      <Container
        @contextmenu.prevent="showContextMenu($event, container)"
        :bannerStyle="container.bannerStyle"
        @dragover="dragOverHandler"
        @drop="onDrop($event, containerIndex)"
        @select-container="selectContainer"
        @add-child="addChild"
        :container="container"
        :index="index"
        :selectedChild="selectedChild"
        @select-child="handleSelectChild"
        @container-hover="handleContainerHover"
        @container-child-hover="handleChildHover"
        @deselect-all="deselectAll"
        :class="containerClass(container.bannerStyle)"
        :isSelected="index === selectedContainerIndex"
        :name="container.containerName"
        :backgroundColor="container.backgroundColor"
        :text="text"
        :fontSize="textSize"
        :fontFamily="textFamily"
        :textColor="textColor"
        :textBGColor="textBGColor"
        :borderRadius="borderRadius"
        :borderWidth="borderWidth"
        :borderColor="borderColor"
        :linkLabel="linkLabel"
        :linkFontSize="linkTextSize"
        :linkFontFamily="linkFamily"
        :linkColor="linkColor"
        :linkBGColor="linkBGColor"
        :linkURL="linkURL"
        :data-has-image="BGImage !== null"
        :imageLink="containers[index].imageLink"
        :BGImage="BGImage"
      />

      <div
        class="dropzone"
        :class="{
          'dropzone--visible': dragging,
          'dropzone--hovered': dragging && hoverIndex === index,
        }"
        @dragover.stop.prevent="updateHoverIndex(index)"
        @drop="onDrop($event, index)"
      >
        <i class="material-icons">add_circle_outline</i>
      </div>
    </div>
    <Properties
      :containers="containers"
      :selectedChild="selectedChild"
      :selectedContainer="selectedContainer"
      :borderColor="borderColor"
      :borderWidth="borderWidth"
      :text="text"
      :textBGColor="textBGColor"
      :linkLabel="linkLabel"
      :imageLink="imageLink"
      @set-text="onBannerTextUpdate"
      @text-font-size-changed="onTextSizeChanged"
      @text-font-family-changed="onTextFamilyChanged"
      @text-color-changed="onTextColorChanged"
      @text-bg-color-changed="onTextBGChanged"
      @set-link-label="onBannerLinkLabelUpdate"
      @link-font-size-changed="onLinkSizeChanged"
      @link-font-family-changed="onLinkFontChanged"
      @link-color-changed="onLinkColorChanged"
      @link-bg-color-changed="onLinkBGColorChanged"
      @set-link-URL="onBannerURLUpdate"
      @set-bg-color="onUpdateBGColor"
      @set-border-color="onUpdateBorderColor"
      @set-border-radius="onUpdateBorderRadius"
      @set-border-width="onUpdateBorderWidth"
      @update-image-BG="onUpdateBGImage"
      @clear-image-BG="onClearBGImage"
      @update-image-nested="onUpdateNestedImage"
      @clear-image-nested="onClearNestedImage"
    />

    <Tree
      @element-drag-start="onElementDragStart"
      @element-drag-end="onElementDragEnd"
      :containers="containers"
      :treeItems="treeItemsWithSelected"
      :selected-item="selectedChild"
      @select-child="handleSelectChild"
      @select-container="selectContainer"
      @container-hover="handleContainerHover"
      @child-hover="handleChildHover"
    />
  </div>
  <div
    class="context-menu"
    :style="{
      top: contextMenu.top,
      left: contextMenu.left,
      display: contextMenu.visible ? 'block' : 'none',
    }"
  >
    <ul>
      <li @click="deleteContainer">Delete</li>
    </ul>
  </div>
</template>

<script>
import Container from "./Container.vue";
import Properties from "./Properties.vue";
import Tree from "./Tree.vue";

export default {
  components: {
    Container,
    Tree,
    Properties,
  },

  data() {
    return {
      containers: [
        {
          containerName: "Container 1",
          isHovered: false,
          isSelected: false,

          //children
          children: [
            {
              name: "Text 1",
              value: "foo",
              type: "text",
              isSelected: false,
              isHovered: false,
              parentContainer: null,
            },
            {
              name: "Text 2",
              value: "bar",
              type: "text",
              isSelected: false,
              isHovered: false,
              parentContainer: null,
            },
            {
              name: "Text 3",
              value: "sac",
              type: "text",
              isSelected: false,
              isHovered: false,
              parentContainer: null,
            },
          ],

          text: "This is some text",
          textSize: "16",
          textFamily: "Arial",
          textColor: "white",
          textBGColor: "transparent",
          linkLabel: "This is some link",
          linkFamily: "Arial",
          linkTextSize: "14",
          linkColor: "yellow",
          linkBGColor: this.linkBGColor,
          linkURL: "https://www.npmjs.com/package/aicommits",
          imageLink:
            "https://cloud.netlifyusercontent.com/assets/344dbf88-fdf9-42bb-adb4-46f01eedd629/713db751-0cc0-4d18-b283-bd707824f201/smashingconf-front-end-sf-2023.png",
          backgroundColor: "white",
          borderColor: "violet",
          borderRadius: 0,
          borderWidth: 2,
          BGImage: null,
        },
        {
          containerName: "Container 2",
          isHovered: false,
          isSelected: false,

          // children
          children: [
            {
              name: "Text 3",
              value: "baz",
              type: "text",
              isSelected: false,
              isHovered: false,
              parentContainer: null,
            },
            {
              name: "Text 4",
              value: "wee",
              type: "text",
              isSelected: false,
              isHovered: false,
              parentContainer: null,
            },
          ],
          text: "This is some text",
          textSize: "16",
          textFamily: "Arial",
          textColor: "white",
          textBGColor: "transparent",
          linkLabel: "This is some link",
          linkFamily: "Arial",
          linkTextSize: "14",
          linkColor: "yellow",
          linkBGColor: this.linkBGColor,
          linkURL: "https://www.npmjs.com/package/aicommits",
          imageLink:
            "https://imgs.search.brave.com/jGVLyId8xm-5LEibe7k3viIX-7hIy8AsNBpAnqoBfjU/rs:fit:1888:225:1/g:ce/aHR0cHM6Ly90c2Ux/Lm1tLmJpbmcubmV0/L3RoP2lkPU9JUC5G/c3lTQ0tPYzRsamcy/aDBkczV0QmNBSGFC/MyZwaWQ9QXBp",
          backgroundColor: "violet",
          borderColor: "violet",
          borderRadius: 0,
          borderWidth: 2,
          BGImage: null,
        },
      ],
      /*      currentSelectionClass: null,
      currentContainerIndex: null, */
      name: `Container ${this.index}`,
      defaultColors: ["purple", "blue"],
      selectedChild: null,
      selectedContainer: null,
      hoveredContainer: null,
      draggedElement: null,
      dragging: false,
      hoverIndex: null,
      //context
      contextMenu: {
        visible: false,
        top: 0,
        left: 0,
        container: null,
      },
    };
  },

  computed: {
    selectedContainerIndex() {
      return this.currentContainerIndex !== null
        ? this.currentContainerIndex
        : null;
    },
    currentSelectionClass() {
      return this.currentSelectionClass !== null
        ? this.currentSelectionClass
        : null;
    },
  },
  created() {
    document.addEventListener("keyup", this.handleKeyUp);
    document.addEventListener("mousedown", this.handleClickOutside);
  },
  mounted() {
    document.addEventListener("mouseup", this.onElementDragEnd);
    window.addEventListener("keydown", this.handleDeleteKeyPress);
  },

  beforeUnmount() {
    document.removeEventListener("mouseup", this.onElementDragEnd);
    document.removeEventListener("mousedown", this.handleClickOutside);
    document.removeEventListener("keyup", this.handleKeyUp);
  },

  methods: {
    ///////////////////////control
    showContextMenu(event, container) {
      event.preventDefault();

      this.contextMenu.visible = true;
      this.contextMenu.top = event.clientY + "px";
      this.contextMenu.left = event.clientX + "px";
      this.contextMenu.container = container;

      this.selectContainer(container);
    },

    handleClickOutside(event) {
      const wrapper = this.$refs.wrapper;
      if (
        this.contextMenu.visible &&
        !event.target.closest(".context-menu") &&
        wrapper.contains(event.target)
      ) {
        this.contextMenu.visible = false;
      }
    },
    //delete
    handleKeyUp(event) {
      if (event.key === "Delete") {
        this.deleteSelectedContainer();
      }
    },
    deleteSelectedContainer() {
      this.containers = this.containers.filter(
        (container) => !container.isSelected
      );
    },
    deleteContainer() {
      const index = this.containers.indexOf(this.contextMenu.container);
      if (index > -1) {
        this.containers.splice(index, 1);
      }
      this.contextMenu.visible = false;
    },
    //drag
    onDrop(event, containerIndex) {
      event.preventDefault();
      if (!this.draggedElement) return;

      const totalContainers = this.containers.length;
      const newContainerName = `Container ${totalContainers + 1}`;

      // Function to generate a random color
      const getRandomColor = () => {
        const randomColor =
          "#" + Math.floor(Math.random() * 16777215).toString(16);
        return randomColor;
      };

      const newContainer = {
        containerName: newContainerName,
        isHovered: false,
        isSelected: false,
        backgroundColor: getRandomColor(), // Use random color
        children: [
          {
            name: "Text 3",
            value: "new",
            type: "text",
            isSelected: false,
            isHovered: false,
            parentContainer: null,
          },
          {
            name: "Text 4",
            value: "container",
            type: "text",
            isSelected: false,
            isHovered: false,
            parentContainer: null,
          },
        ],
      };

      this.containers.splice(containerIndex + 1, 0, newContainer);

      this.draggedElement = null;
    },

    dragOverHandler(index) {
      this.hoveredContainer = index;
    },

    onDropContainer(index) {
      // add child to containers[index]
      this.containers[index].children.push(this.newChild);
      // reset hoveredContainer to null
      this.hoveredContainer = null;
    },

    updateHoverIndex(index) {
      if (this.dragging) {
        this.hoverIndex = index;
      } else {
        this.hoverIndex = null;
      }
    },

    onElementDragStart(element) {
      this.draggedElement = element;
      this.dragging = true;
    },
    onElementDragEnd() {
      this.draggedElement = null;
      this.dragging = false;
      this.hoverIndex = null;
    },
    //class
    containerClass(bannerStyle) {
      let classes = ["container"];
      if (bannerStyle === "style1") {
        classes.push("container--style1");
      } else if (bannerStyle === "style2") {
        classes.push("container--style2");
      }
      return classes;
    },
    //select
    deselectAll() {
      this.containers.forEach((container) => {
        container.isSelected = false;
        if (container.children) {
          container.children.forEach((child) => {
            child.isSelected = false;
          });
        }
      });
      this.selectedContainer = null;
    },
    dehoverAll() {
      this.containers.forEach((container) => {
        container.isHovered = false;
        if (container.children) {
          container.children.forEach((child) => {
            child.isHovered = false;
          });
        }
      });
    },

    selectContainer(container) {
      this.deselectAll();
      container.isSelected = true;
      this.selectedContainer = container;
    },

    handleSelectChild(child) {
      this.deselectAll();
      child.isSelected = true;
      this.selectedChild = child;
    },

    /*     addChild(containerIndex, child) {
      this.containers[containerIndex].children.push(child);
    }, */

    handleWrapperClick(event) {
      if (!event.target.closest(".container")) {
        this.$emit("deselect-all");
      }
    },

    handleContainerHover(container) {
      // Reset isHovered for all other containers
      this.dehoverAll();
      container.isHovered = true;
    },

    handleChildHover(child, container) {
      this.dehoverAll();

      // Dehover the parent container of the child
      container.isHovered = false;

      child.isHovered = true;
    },

    // text settings
    onBannerTextUpdate(text, child) {
      if (!this.containers) return; // check that containers is defined
      const containerIndex = this.containers.findIndex((container) =>
        container.children.includes(child)
      );
      if (containerIndex !== -1) {
        const container = this.containers[containerIndex];
        const childIndex = container.children.indexOf(child);

        // Create a new object with the updated value
        const updatedChild = { ...child, value: text };

        // Update the child object in the container
        container.children.splice(childIndex, 1, updatedChild);

        // Check if the updated child is currently selected
        if (this.selectedChild === child) {
          // Update the selectedChild object in the component
          this.selectedChild = updatedChild;
        }
      }
    },

    onTextSizeChanged(text) {
      this.textSize = text;
    },
    onTextFamilyChanged(text) {
      this.textFamily = text;
    },
    onTextColorChanged(color) {
      this.textColor = color;
    },
    onTextBGChanged(color) {
      this.textBGColor = color;
    },

    // link settings
    onLinkSizeChanged(text) {
      this.linkTextSize = text;
    },
    onBannerLinkLabelUpdate(text) {
      this.linkLabel = text;
    },
    onLinkFontChanged(text) {
      this.linkFamily = text;
    },
    onLinkColorChanged(color) {
      this.linkColor = color;
    },
    onLinkBGColorChanged(color) {
      this.linkBGColor = color;
    },
    onBannerURLUpdate(text) {
      this.linkURL = text;
    },

    onUpdateBGColor({ container, color }) {
      if (color === null) {
        container.backgroundColor = this.defaultColors[container.index];
      } else {
        container.backgroundColor = color;
      }
    },

    onUpdateBorderColor(color) {
      this.borderColor = color;
    },
    onUpdateBorderRadius(sliderValue) {
      this.borderRadius = sliderValue;
    },
    onUpdateBorderWidth(sliderValue) {
      this.borderWidth = sliderValue;
    },
    onSetSidebar(sidebar) {
      this.sidebar = sidebar;
    },
    onUpdateBGImage(image) {
      this.BGImage = image;
    },
    onClearBGImage() {
      this.BGImage = null;
    },
    onUpdateNestedImage(image) {
      this.imageLink = image;
    },
    onClearNestedImage() {
      this.imageLink = null;
    },
  },
};
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column; /* Change from 'grid' to 'flex' */
  justify-content: center; /* Add this line */
  align-items: center; /* Add this line */
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: transparent;
  z-index: 2;
}

.dropzone {
  min-width: 520px;
  display: none;
  align-items: center;
  justify-content: center;
  min-height: 24px;
  color: white;
  background-color: #80bbff;
  transition: min-height 0.2s ease, background-color 0.2s ease;
}

.dropzone--visible {
  display: flex;
}

.dropzone--hovered {
  min-height: 48px;
  background-color: #1280ff;
}
.context-menu {
  color: #555;
  position: absolute;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.context-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
  min-width: 80px;
}

.context-menu li {
  padding: 5px;
  cursor: pointer;
}

.context-menu li:hover {
  background-color: #ededed;
  transition: background-color 0.2s ease;
}
</style>
