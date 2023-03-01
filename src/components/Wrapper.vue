<template>
  <div class="wrapper">
    <Container
      class="container"
      :name="containerName"
      :backgroundColor="backgroundColor"
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
      :imageLink="imageLink"
      :BGImage="BGImage"
    />
  </div>
  <SidebarRight
    :color="backgroundColor"
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
      containerName: "some text",
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
      imageLink: this.imageLink,
      backgroundColor: "purple",
      borderColor: "violet",
      borderRadius: 0,
      borderWidth: 2,
      BGImage: null,
    };
  },
  methods: {
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

    onUpdateBGColor(color) {
      this.backgroundColor = color;
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
  display: inline-block;

  background-color: transparent;
  z-index: 2;
}
</style>
