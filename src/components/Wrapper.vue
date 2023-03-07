<template>
  <div class="wrapper">
    <div v-for="(container, index) in containers" :key="index">
      <Container
        @click="selectContainer(index)"
        class="container"
        :isSelected="index === selectedContainerIndex"
        :name="container.containerName"
        :backgroundColor="containers[index].backgroundColor"
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
    <SidebarRight
      :currentContainerIndex="selectedContainerIndex"
      :containerName="containers[selectedContainerIndex].containerName"
      :backgroundColor="containers[selectedContainerIndex].backgroundColor"
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
  </div>
</template>

<script>
import Container from "./Container.vue";
import SidebarRight from "./SidebarRight.vue";

export default {
  components: {
    Container,
    SidebarRight,
  },

  data() {
    return {
      containers: [
        {
          containerName: "Container 1",
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
          backgroundColor: "grey",
          borderColor: "violet",
          borderRadius: 0,
          borderWidth: 2,
          BGImage: null,
        },
        {
          containerName: "Container 2",
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
      currentContainerIndex: null,
      defaultColors: ["purple", "blue"],
    };
  },

  computed: {
    selectedContainerIndex() {
      return this.currentContainerIndex !== null
        ? this.currentContainerIndex
        : 0;
    },
  },
  methods: {
    //control
    selectContainer(index) {
      this.currentContainerIndex = index;
    },

    // text settings
    onBannerTextUpdate(text) {
      this.text = text;
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
