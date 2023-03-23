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
      @dragover.stop.prevent="updateHoverIndex(index)"
      @drop="onNewContainerDrop($event, index)"
      class="dropzone"
      :class="{
        'dropzone--hovered': dropzoneHovered(index),
      }"
      v-show="dragging && dragSource != 'tree' && containers.length <= 1"
    >
      <i class="material-icons">add_circle_outline</i>
    </div>
    <!--     <div
      class="transparent-dropzone"
      @dragover.prevent="updateHoverIndex(-1)"
      @drop="handleExistingElementDrop({ type: 'container', index: 0 })"
    ></div> -->
    <div
      v-for="(container, index) in containers"
      :key="index"
      @dragstart="
        handleExistingElementDragStart(
          { item, index, type: 'container' },
          $event,
          'main'
        )
      "
      @drag="updateFloatingContainerPosition($event)"
      @dragend="onElementFromAssetsDragEnd"
    >
      <div
        @dragover.stop.prevent="updateHoverIndex(index)"
        @drop="onNewContainerDrop($event, index)"
        class="dropzone"
        :class="{
          'dropzone--hovered': dropzoneHovered(index),
        }"
        v-show="
          dragging &&
          dragSource != 'tree' &&
          containers.length > 1 &&
          draggedContainerIndex !== index
        "
      >
        <i class="material-icons">add_circle_outline</i>
      </div>

      <Container
        :draggable="containers.length > 1"
        :backgroundColor="container.backgroundColor"
        :bannerStyle="container.bannerStyle"
        :BGImage="BGImage"
        :borderColor="borderColor"
        :borderRadius="borderRadius"
        :borderWidth="borderWidth"
        :class="{
          'container--dragging':
            dragging && draggedElement && draggedElement.index === index,
        }"
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
        @item-hover="hoverItem"
        @select-item="selectItem"
      />
    </div>
    <div
      @dragover.stop.prevent="updateHoverIndex(containers.length)"
      @drop="onNewContainerDrop($event, containers.length)"
      class="dropzone"
      :class="{
        'dropzone--hovered': dropzoneHovered(containers.length),
      }"
      v-show="dragging && dragSource != 'tree' && containers.length >= 0"
    >
      <i class="material-icons">add_circle_outline</i>
    </div>
    <!--     <div
      class="transparent-dropzone"
      @dragover.prevent="updateHoverIndex(containers.length - 1)"
      @drop="
        handleExistingElementDrop({
          type: 'container',
          index: containers.length,
        })
      "
    ></div> -->
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
      @dehover="dehoverAll"
      @drag-start="
        handleExistingElementDragStart(
          {
            item: $event.item,
            index: $event.index,
            type: $event.type,
            containerIndex: $event.containerIndex,
          },
          $event.event,
          'tree'
        )
      "
      @drop="handleExistingElementDrop"
      @element-drag-end="onElementFromAssetsDragEnd"
      @element-drag-start="
        handleExistingElementDragStart(
          { item: $event.item, index: $event.index, type: $event.type },
          $event.event,
          'assets'
        )
      "
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
      tempContainer: null,
      floatingContainer: null,
      dragOffset: { x: 0, y: 0 },
      dragging: false,
      dragSource: null,
      hoverIndex: null,
      draggedContainerIndex: null,
      originalContainerIndex: null,
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

    dropzoneHovered() {
      return (index) => this.dragging && this.hoverIndex === index;
    },
  },
  /*   created() {
    document.addEventListener("keyup", this.handleKeyUp);
    document.addEventListener("mousedown", this.handleClickOutside);
  }, */
  mounted() {
    document.addEventListener("mouseup", this.onElementFromAssetsDragEnd);
    window.addEventListener("keydown", this.handleDeleteKeyPress); // Change this line
    document.addEventListener("click", this.handleClickOutside);
  },

  beforeUnmount() {
    document.removeEventListener("mouseup", this.onElementFromAssetsDragEnd);
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

    //drag for new elements (from assets)
    onNewContainerDrop(event, containerIndex) {
      event.preventDefault();
      if (!this.draggedElement) return;

      if (this.dragSource === "assets") {
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
          type: "container",
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

        this.containers.splice(containerIndex, 0, newContainer);
      } else {
        // Move the existing container to the new position
        const draggedContainer = this.containers.splice(
          this.draggedContainerIndex,
          1
        )[0];

        if (containerIndex > this.originalContainerIndex) {
          containerIndex--;
        }
        this.containers.splice(containerIndex, 0, draggedContainer);
      }

      this.originalContainerIndex = null;
    },

    updateHoverIndex(index) {
      if (this.dragging) {
        if (
          this.dragSource === "main" &&
          this.draggedElement.containerIndex < index
        ) {
          index--;
        }
        this.hoverIndex = index;
      } else {
        this.hoverIndex = null;
      }
    },

    /*  onElementFromAssetsDragStart(element) {
      this.draggedElement = element;
      this.dragging = true;
    }, */
    onElementFromAssetsDragEnd() {
      this.draggedElement = null;
      this.dragging = false;
      this.hoverIndex = null;
      this.dragSource = null;
      this.draggedContainerIndex = null;

      if (this.floatingContainer) {
        this.floatingContainer.remove();
        this.floatingContainer = null;
      }

      if (this.tempContainer) {
        // Add the container back to its original position
        this.containers.splice(this.tempContainer.index, 0, this.tempContainer);
        this.tempContainer = null;
      }
      const containerElements =
        this.$refs.wrapper.querySelectorAll(".container");
      containerElements.forEach((containerElement) => {
        containerElement.style.display = "";
      });
    },

    //drag for existing elements (rearrange)

    handleExistingElementDragStart(
      { item, index, type, containerIndex },
      event,
      source
    ) {
      this.draggedContainerIndex = index;
      this.originalContainerIndex = index;
      if (event && event.dataTransfer) {
        event.dataTransfer.setData("text/plain", ""); // for Firefox compatibility
      }
      this.draggedElement = { item, index, type, containerIndex };
      if (type === "container") {
        this.draggedContainerIndex = index;
      } // for Firefox compatibility
      this.draggedElement = { item, index, type, containerIndex };
      if (type === "container") {
        this.draggedContainerIndex = index;
        this.originalContainerIndex = index; // Store the original index
      }
      this.draggedElement = { item, index, type, containerIndex };
      this.dragging = true;
      this.dragSource = source;

      let containerElement;

      if (source === "main") {
        // Remove the dragged container

        containerElement = event.target.closest(".container");
      }

      if (!containerElement) return;

      // Create a clone of the container element
      const floatingContainer = containerElement.cloneNode(true);
      floatingContainer.classList.add("floating-container");

      // Set the initial position and append it to the body
      floatingContainer.style.left = `${event.clientX}px`;
      floatingContainer.style.top = `${event.clientY}px`;
      document.body.appendChild(floatingContainer);

      // Set the drag offset
      const rect = containerElement.getBoundingClientRect();
      this.dragOffset.x = event.clientX - rect.left;
      this.dragOffset.y = event.clientY - rect.top;

      // Assign the floating container
      this.floatingContainer = floatingContainer;

      requestAnimationFrame(() => {
        containerElement.style.display = "none";
      });
    },

    updateFloatingContainerPosition(event) {
      if (this.floatingContainer) {
        const x = event.clientX;
        const y = event.clientY;
        this.floatingContainer.style.left = x + "px";
        this.floatingContainer.style.top = y + "px";
      }
    },

    handleExistingElementDragOver(
      event,
      item,
      index,
      type,
      containerIndex = null
    ) {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";

      const containerElement = event.target.closest(".container");
      const rect = containerElement.getBoundingClientRect();
      const midY = (rect.top + rect.bottom) / 2;

      // Update the hover index based on the mouse position
      if (event.clientY < midY) {
        this.updateHoverIndex(index - 1);
      } else {
        this.updateHoverIndex(index);
      }
    },

    handleExistingElementDrop({ item, index, type, containerIndex }) {
      if (!this.draggedElement) return;

      const from = this.draggedElement;

      // Remove the floating container

      // Handle container drag and drop
      if (from.type === "container" && type === "container") {
        const draggedContainer = this.containers.splice(
          this.draggedContainerIndex,
          1
        )[0];
        this.containers.splice(index, 0, draggedContainer);
      }

      // Handle child drag and drop within the same container
      else if (
        from.type === "child" &&
        type === "child" &&
        from.containerIndex === containerIndex
      ) {
        const draggedChild = this.containers[containerIndex].children.splice(
          from.index,
          1
        )[0];
        this.containers[containerIndex].children.splice(
          index !== null
            ? index
            : this.containers[containerIndex].children.length,
          0,
          draggedChild
        );
      }

      // Handle child drag and drop between different containers
      else if (
        from.type === "child" &&
        type === "child" &&
        from.containerIndex !== containerIndex
      ) {
        const draggedChild = this.containers[
          from.containerIndex
        ].children.splice(from.index, 1)[0];
        this.containers[containerIndex].children.splice(
          index !== null
            ? index
            : this.containers[containerIndex].children.length,
          0,
          draggedChild
        );
      }

      // Handle child drag and drop onto container
      else if (from.type === "child" && type === "container") {
        const draggedChild = this.containers[
          from.containerIndex
        ].children.splice(from.index, 1)[0];
        item.children.push(draggedChild);
      }
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
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 24px;
  color: white;
  background-color: #80bbff;
  transition: min-height 0.2s ease, background-color 0.2s ease;
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

.floating-container {
  position: fixed;
  pointer-events: none;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06);
  opacity: 0.8;
}
.transparent-dropzone {
  height: 50vh;
  width: 100%;
}
.container--hidden > * {
  display: none !important;
}
</style>
