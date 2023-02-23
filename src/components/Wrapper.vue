<template>
  <div
    class="wrapper"
    @mouseover="showOptionsButton = true"
    @mouseout="showOptionsButton = false"
  >
    <Container
      class="container"
      :name="containerName"
      :backgroundColor="backgroundColor"
      :bannerText="bannerText"
      :borderRadius="borderRadius"
      :borderWidth="borderWidth"
      :color="color"
      :borderColor="borderColor"
      :linkLabel="linkLabel"
      :linkURL="linkURL"
      :data-has-image="BGImage !== null"
      :imageLink="imageLink"
      :BGImage="BGImage"
    />
    <!--     <options-button
      :is-active="showOptionsButton"
      @update-text="onBannerTextUpdate"
      @update-color="onUpdateColor" -->
    <!--     @update-border-radius="onUpdateBorderRadius" @set-sidebar="onSetSidebar" /> -->
  </div>
  <SidebarRight
    :color="backgroundColor"
    :borderColor="borderColor"
    :borderWidth="borderWidth"
    :displayText="bannerText"
    :linkLabel="linkLabel"
    @set-text="onBannerTextUpdate"
    @set-link-label="onBannerLinkLabelUpdate"
    @set-link-URL="onBannerURLUpdate"
    @set-color="onUpdateColor"
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
/* import OptionsButton from "./OptionsButton.vue"; */
import SidebarRight from "./SidebarRight.vue";

export default {
  components: {
    /*     OptionsButton, */
    Container,
    SidebarRight,
  },
  data() {
    return {
      containerName: "some text",
      bannerText: "This is some text",
      linkLabel: "This is some link",
      linkURL: "https://www.npmjs.com/package/aicommits",
      imageLink: null,
      showOptionsButton: false,
      showChangeTextPopup: false,
      backgroundColor: "transparent",
      borderColor: "yellow",
      borderRadius: 0,
      borderWidth: 2,
      BGImage: null,
    };
  },
  methods: {
    onBannerTextUpdate(text) {
      this.bannerText = text;
      this.showChangeTextPopup = false;
    },
    onBannerLinkLabelUpdate(text) {
      this.linkLabel = text;
      this.showChangeTextPopup = false;
    },
    onBannerURLUpdate(text) {
      this.linkURL = text;
      this.showChangeTextPopup = false;
    },

    onUpdateColor(color) {
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
