<template>
  <div
    class="wrapper"
    @mouseover="showOptionsButton = true"
    @mouseout="showOptionsButton = false"
  >
    <Container
      class="container"
      :backgroundColor="backgroundColor"
      :bannerText="bannerText"
    />
    <options-button
      :is-active="showOptionsButton"
      @update-text="onBannerTextUpdate"
      @update-color="onUpdateColor"
    />
  </div>
</template>

<script>
import Container from "./Container.vue";
import OptionsButton from "./OptionsButton.vue";

export default {
  components: {
    OptionsButton,
    Container,
  },
  data() {
    return {
      bannerText: "This is some text",
      showOptionsButton: false,
      showChangeTextPopup: false,
      backgroundColor: "purple",
    };
  },
  methods: {
    onBannerTextUpdate(value) {
      this.bannerText = value;
      this.showChangeTextPopup = false;
    },
    onUpdateColor(color) {
      this.backgroundColor = color;
    },
  },
};
</script>

<style scoped>
.wrapper {
  min-width: 600px;
  min-height: 200px;
  display: inline-block;
  border: 2px solid blue;
  background-color: transparent;
  z-index: 2;
}
</style>
