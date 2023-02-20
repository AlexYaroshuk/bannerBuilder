<template>
  <div
    class="wrapper"
    @mouseover="showOptionsButton = true"
    @mouseout="showOptionsButton = false"
  >
    <container
      class="container"
      :backgroundColor="backgroundColor"
      :text="text"
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
      text: "Hello World!",
      showOptionsButton: false,
      showChangeTextPopup: false,
      backgroundColor: "purple",
    };
  },
  methods: {
    onBannerTextUpdate(value) {
      this.text = value;
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
  display: inline-block;
  border: 2px solid blue;
  background-color: transparent;
}
</style>
