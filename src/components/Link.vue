<template>
  <div :style="{ backgroundColor: linkBGColor }">
    <a class="link" :href="linkURL" :style="{ color: linkColor }">
      {{ linkLabel }}</a
    >
  </div>
</template>

<script>
export default {
  props: ["linkURL", "linkLabel", "linkColor", "linkBGColor"],
};
</script>

<style scoped>
.link {
  /*   font-size: large; */

  z-index: 1;

  /* Add this line to give the parent element a position */
}
</style>
