<template>
  <img class="img" :src="imgLink" />
</template>

<script>
export default {
  props: ["imgLink"],
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
