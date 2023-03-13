<template>
  <div class="wrapper">
    <div v-for="(container, index) in containers" :key="index">
      <Container
        @select-container="selectContainer(index)"
        :children="getChildrenForContainer(index)"
        :index="index"
        :selectedChild="selectedChild"
        @select-child="handleSelectChild"
        @deselect-all="deselectAll"
        class="container"
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
    </div>
    <Properties
      :containers="containers"
      :currentSelectionClass="currentSelectionClass"
      :currentContainerIndex="
        selectedContainerIndex !== null ? selectedContainerIndex : undefined
      "
      :containerName="
        selectedContainerIndex !== null
          ? containers[selectedContainerIndex].containerName
          : ''
      "
      :backgroundColor="
        selectedContainerIndex !== null
          ? containers[selectedContainerIndex].backgroundColor
          : ''
      "
      :selectedChild="selectedChild"
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

    <Tree :treeItems="treeItemsWithSelected" />
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

          //children
          children: [
            {
              name: "Text 1",
              value: "foo",
              type: "text",
              isSelected: false,
            },
            {
              name: "Text 2",
              value: "bar",
              type: "text",
              isSelected: false,
            },
            {
              name: "Text 3",
              value: "sac",
              type: "text",
              isSelected: false,
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

          // children
          children: [
            {
              name: "Text 3",
              value: "baz",
              type: "text",
              isSelected: false,
            },
            {
              name: "Text 4",
              value: "wee",
              type: "text",
              isSelected: false,
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
      currentSelectionClass: null,
      currentContainerIndex: null,
      name: `Container ${this.index}`,
      defaultColors: ["purple", "blue"],
      selectedChild: {},
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

    treeItemsWithSelected() {
      return this.containers.map((container) => {
        const children = container.children
          ? container.children
              .filter((child) => child.type === "text")
              .map((child) => ({
                ...child,
                isSelected: this.selectedChild === child,
              }))
          : [];
        container.isSelected =
          container.isSelected || children.some((child) => child.isSelected);
        return {
          containerName: container.containerName,
          isSelected: container.isSelected,
          children,
        };
      });
    },
  },

  /*   created() {
    this.$root.$on("deselect-all", this.deselectAll);
  }, */

  methods: {
    //control
    selectContainer(index) {
      this.currentContainerIndex = index;
      this.currentSelectionClass = "container";

      this.containers.forEach((container, i) => {
        container.isSelected = i === index;
      });

      this.containers[index].children.forEach((child) => {
        child.isSelected = false;
      });
    },

    deselectContainer(event) {
      const isClickedInsideContainer =
        event.target.closest(".container") !== null;
      if (!isClickedInsideContainer) {
        this.currentContainerIndex = null;
      }
    },

    deselectAll() {
      this.containers.forEach((container) => {
        container.isSelected = false;
        if (container.children) {
          container.children.forEach((child) => {
            child.isSelected = false;
          });
        }
      });
      this.selectedChild = {};
    },

    handleWrapperClick(event) {
      if (!event.target.closest(".container")) {
        this.$emit("deselect-all");
      }
    },

    handleSelectChild(child, childIndex, containerName) {
      // Update selectedChild prop
      const container = this.containers.find(
        (c) => c.containerName === containerName
      );
      this.selectedChild = container.children[childIndex];
      // Emit select-child event
      this.currentSelectionClass = this.selectedChild.type;
    },

    getChildrenForContainer(index) {
      if (index !== null && this.containers[index].children) {
        return this.containers[index].children
          .filter((child) => child.type === "text")
          .map((child) => ({
            ...child,
            isSelected: child.isSelected || false,
          }));
      } else {
        return [];
      }
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

    onUpdateBGColor({ index, color }) {
      const updatedContainers = [...this.containers];
      const container = updatedContainers[index];

      if (color === null) {
        container.backgroundColor = this.defaultColors[index];
      } else {
        container.backgroundColor = color;
      }

      this.containers = updatedContainers;
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
  min-width: 600px;
  min-height: 200px;
  display: grid;
  /*   gap: 8px; */

  background-color: transparent;
  z-index: 2;
}
</style>
