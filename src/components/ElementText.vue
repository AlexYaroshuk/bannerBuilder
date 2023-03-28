<template>
  <div class="btext" :style="{ backgroundColor: textBGColor }">
    <p class="">{{ text }}</p>
  </div>
</template>

<script>
export default {
  props: {
    text: String,
    textBGColor: String,
    value: String,
    isSelected: Boolean,
  },
  computed: {
    classes() {
      return {
        "child-text": true,
        "child-text--selected": this.isSelected && this.value,
      };
    },
  },
};
</script>

<style scoped>
.btext {
  /*   font-size: large; */

  /*   z-index: 1; */
  padding: 4px;
  color: black;

  /* Add this line to give the parent element a position */
}
</style>
