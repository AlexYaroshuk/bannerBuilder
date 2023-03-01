<template>
  <img class="img" :src="imageLink" />
</template>

<script>
export default {
  props: ["imageLink"],
};
</script>

<style scoped>
.img {
  width: 100%;
  max-height: 48px;
  object-fit: cover;

  /* Add this line to give the parent element a position */
}
</style>
