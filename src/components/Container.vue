<template>
  <div :style="{ backgroundColor: backgroundColor }">
    <slot name="text" :text="text"></slot>
  </div>
</template>

<script>
import Text from "./Text.vue";

export default {
  props: {
    backgroundColor: {
      type: String,
      default: "green",
    },
  },

  components: {
    Text,
  },
  data() {
    return {
      text: "",

      bannerText: "text",
    };
  },
  methods: {
    onBannerTextUpdate(value) {
      this.text = value;
    },
    onUpdateColor(color) {
      this.backgroundColor = color;
    },
  },
};
</script>

<style scoped>
.container {
  padding: 1rem;
  opacity: 0.5;
  width: 600px;
  height: 200px;
  align-self: center;
  position: relative;
  /* Add this line to give the parent element a position */
}
</style>
