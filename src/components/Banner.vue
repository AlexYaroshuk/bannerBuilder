<template>
  <div>
    <p
      class="banner"
      :style="{ backgroundColor: bannerColor }"
      @mouseover="showOptionsButton = true"
      @mouseout="showOptionsButton = false"
    >
      {{ bannerText }}
      <options-button
        :is-active="showOptionsButton"
        @update-text="onBannerTextUpdate"
        @update-color="onUpdateColor"
      />
    </p>
  </div>
</template>

<script>
import OptionsButton from "./OptionsButton.vue";

export default {
  components: {
    OptionsButton,
  },
  data() {
    return {
      showOptionsButton: false,
      showChangeTextPopup: false,
      bannerText: "text",
      bannerColor: "purple",
    };
  },
  methods: {
    onBannerTextUpdate(value) {
      this.bannerText = value;
      this.showChangeTextPopup = false;
    },
    onUpdateColor(color) {
      this.bannerColor = color;
    },
  },
};
</script>

<style scoped>
.banner {
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
