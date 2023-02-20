<template>
  <div class="link">
    <p>{{ text }}</p>
  </div>
</template>

<script>
export default {
  props: ["link"],
};
</script>

<style scoped>
.link {
  color: rgb(60, 25, 255);
  text-decoration: underline;
  font-size: large;
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  /* Add this line to give the parent element a position */
}
</style>
