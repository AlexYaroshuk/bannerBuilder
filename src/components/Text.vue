<template>
  <div class="text">
    <h1>tet</h1>
    <p>t{{ text }}</p>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: "text",
    },
  },

  data() {
    return {
      text: "text",
    };
  },
  emits: ["update:receivedText"],
};
</script>

<style scoped>
.text {
  color: white;
  font-size: large;
  position: absolute;
  z-index: 45;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  /* Add this line to give the parent element a position */
}
</style>
