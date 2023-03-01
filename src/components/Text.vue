<template>
  <div class="btext" :style="{ backgroundColor: textBGColor }">
    <p>{{ text }}</p>
  </div>
</template>

<script>
export default {
  props: ["text", "textBGColor"],
};
</script>

<style scoped>
.btext {
  /*   font-size: large; */

  z-index: 1;

  /* Add this line to give the parent element a position */
}
</style>
