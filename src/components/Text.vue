<template>
  <div class="btext">
    <p>{{ bannerText }}</p>
  </div>
</template>

<script>
export default {
  props: ["bannerText"],
};
</script>

<style scoped>
.btext {
  color: white;
  /*   font-size: large; */

  z-index: 1;

  /* Add this line to give the parent element a position */
}
</style>
