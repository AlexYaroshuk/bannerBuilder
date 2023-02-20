<template>
  <div
    class="wrapper"
    :style="{ backgroundColor: bannerColor }"
    @mouseover="showOptionsButton = true"
    @mouseout="showOptionsButton = false"
  >
    <Container>
      <text :received-text="text" @update:receivedText="text = $event" />
    </Container>
    <options-button
      :is-active="showOptionsButton"
      @update-text="onBannerTextUpdate"
      @update-color="onUpdateColor"
    />
  </div>
</template>

<script>
import OptionsButton from "./OptionsButton.vue";
import Text from "./Text.vue";

export default {
  components: {
    OptionsButton,
    Text,
  },
  data() {
    return {
      text: "",
      showOptionsButton: false,
      showChangeTextPopup: false,
      bannerText: "text",
      bannerColor: "purple",
    };
  },
  methods: {
    onBannerTextUpdate(value) {
      this.text = value;
      this.showChangeTextPopup = false;
    },
    onUpdateColor(color) {
      this.bannerColor = color;
    },
  },
};
</script>

<style scoped>
.wrapper {
  padding: 1rem;
  background-color: purple;
  opacity: 1;
  color: white;
  width: 600px;
  height: 200px;
  align-self: center;
  position: relative;
  /* Add this line to give the parent element a position */
}
</style>
