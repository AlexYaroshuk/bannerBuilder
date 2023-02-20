<template>
  <div :style="{ backgroundColor: backgroundColor }">
    <Text :text="text" />
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
    text: {
      type: String,
      default: "",
    },
  },

  components: {
    Text,
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
  height: 200px;
  background-color: #ccc;
  position: relative;
  /* Add this line to give the parent element a position */
}
</style>
