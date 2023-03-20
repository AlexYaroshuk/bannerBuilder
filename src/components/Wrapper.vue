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
      @dragover.stop.prevent="updateHoverIndex(index - 1)"
      @drop="onDrop($event, index - 1)"
      v-if="containers.length === 0"
      class="dropzone"
      :class="{
        'dropzone--visible': dragging,
        'dropzone--hovered': dragging && hoverIndex === index - 1,
      }"
    >
      <i class="material-icons">add_circle_outline</i>
    </div>
    <div v-for="(container, index) in containers" :key="index">
      <div
        @dragover.stop.prevent="updateHoverIndex(index - 1)"
        @drop="onDrop($event, index - 1)"
        v-if="index === 0"
        class="dropzone"
        :class="{
          'dropzone--visible': dragging,
          'dropzone--hovered': dragging && hoverIndex === index - 1,
        }"
      >
        <i class="material-icons">add_circle_outline</i>
      </div>
      <Container
        :backgroundColor="container.backgroundColor"
        :bannerStyle="container.bannerStyle"
        :BGImage="BGImage"
        :borderColor="borderColor"
        :borderRadius="borderRadius"
        :borderWidth="borderWidth"
        :class="containerClass(container.bannerStyle)"
        :container="container"
        :data-has-image="BGImage !== null"
        :fontFamily="textFamily"
        :fontSize="textSize"
        :imageLink="containers[index].imageLink"
        :index="index"
        :isSelected="index === selectedContainerIndex"
        :linkBGColor="linkBGColor"
        :linkColor="linkColor"
        :linkFontFamily="linkFamily"
        :linkFontSize="linkTextSize"
        :linkLabel="linkLabel"
        :linkURL="linkURL"
        :name="container.containerName"
        :selectedChild="selectedChild"
        :text="text"
        :textBGColor="textBGColor"
        :textColor="textColor"
        @add-child="addChild"
        @container-dehover="dehoverAll"
        @contextmenu.prevent="showContextMenu($event, container)"
        @deselect-all="deselectAll"
        @dragover="dragOverHandler"
        @drop="onDrop($event, containerIndex)"
        @item-hover="hoverItem"
        @select-item="selectItem"
      />

      <div
        @dragover.stop.prevent="updateHoverIndex(index)"
        @drop="onDrop($event, index)"
        class="dropzone"
        :class="{
          'dropzone--visible': dragging,
          'dropzone--hovered': dragging && hoverIndex === index,
        }"
      >
        <i class="material-icons">add_circle_outline</i>
      </div>
    </div>
    <Properties
      :borderColor="borderColor"
      :borderWidth="borderWidth"
      :containers="containers"
      :imageLink="imageLink"
      :linkLabel="linkLabel"
      :selectedChild="selectedChild"
      :selectedContainer="selectedContainer"
      :text="text"
      :textBGColor="textBGColor"
      @clear-image-BG="onClearBGImage"
      @clear-image-nested="onClearNestedImage"
      @link-bg-color-changed="onLinkBGColorChanged"
      @link-color-changed="onLinkColorChanged"
      @link-font-family-changed="onLinkFontChanged"
      @link-font-size-changed="onLinkSizeChanged"
      @set-bg-color="onUpdateBGColor"
      @set-border-color="onUpdateBorderColor"
      @set-border-radius="onUpdateBorderRadius"
      @set-border-width="onUpdateBorderWidth"
      @set-link-label="onBannerLinkLabelUpdate"
      @set-link-URL="onBannerURLUpdate"
      @set-text="onBannerTextUpdate"
      @text-bg-color-changed="onTextBGChanged"
      @text-color-changed="onTextColorChanged"
      @text-font-family-changed="onTextFamilyChanged"
      @text-font-size-changed="onTextSizeChanged"
      @update-image-BG="onUpdateBGImage"
      @update-image-nested="onUpdateNestedImage"
      ref="properties"
    />

    <LeftSidebar
      :containers="containers"
      :selected-item="selectedChild"
      @element-drag-end="onElementDragEnd"
      @element-drag-start="onElementDragStart"
      @hover-item="hoverItem"
      @select-item="selectItem"
      @tree-dehover="dehoverAll"
      ref="tree"
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
import LeftSidebar from "./LeftSidebar.vue";

export default {
  components: {
    Container,
    Properties,
    LeftSidebar,
  },

  data() {
    return {
      containers: [
        {
          containerName: "Container 1",
          isHovered: false,
          isSelected: false,
          type: "container",

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
          type: "container",

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
      selectedItem: null,
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
  /*   created() {
    document.addEventListener("keyup", this.handleKeyUp);
    document.addEventListener("mousedown", this.handleClickOutside);
  }, */
  mounted() {
    document.addEventListener("mouseup", this.onElementDragEnd);
    window.addEventListener("keydown", this.handleDeleteKeyPress); // Change this line
    document.addEventListener("click", this.handleClickOutside);
  },

  beforeUnmount() {
    document.removeEventListener("mouseup", this.onElementDragEnd);
    document.removeEventListener("click", this.handleClickOutside);
    window.removeEventListener("keydown", this.handleDeleteKeyPress); // Change this line
  },

  methods: {
    //control
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
      const tree = this.$refs.tree;
      const properties = this.$refs.properties;

      if (
        this.contextMenu.visible &&
        !event.target.closest(".context-menu") &&
        wrapper.contains(event.target)
      ) {
        this.contextMenu.visible = false;
      }

      // Check if the click event is not inside Tree or Properties components
      if (
        !tree.$el.contains(event.target) &&
        !properties.$el.contains(event.target)
      ) {
        this.deselectAll();
        this.dehoverAll();
      }
    },

    //delete
    handleDeleteKeyPress(event) {
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
      this.containers[index].children.push(this.newChild);

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

    //select, hover, deselect, dehover
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
      this.selectedChild = null;
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

    selectItem(item) {
      this.deselectAll();
      item.isSelected = true;

      if (item.type === "container") {
        this.selectedContainer = item;
      } else {
        this.selectedChild = item;
      }
    },

    hoverItem(item) {
      this.dehoverAll();

      item.isHovered = true;
    },

    /*     addChild(containerIndex, child) {
      this.containers[containerIndex].children.push(child);
    }, */

    handleWrapperClick(event) {
      if (!event.target.closest(".container")) {
        this.$emit("deselect-all");
      }
      this.selectedChild = null;
    },

    handleDehover() {
      this.dehoverAll();
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
