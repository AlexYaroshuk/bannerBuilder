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
  padding: 4px;
  color: black;
}
</style>
