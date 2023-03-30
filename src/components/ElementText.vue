<template>
  <div class="btext" :style="colorStyle">
    <p class="">{{ text }}</p>
  </div>
</template>

<script>
export default {
  props: {
    child: Object,
    text: String,

    isSelected: Boolean,
  },
  computed: {
    classes() {
      return {
        "child-text": true,
        "child-text--selected": this.isSelected && this.value,
      };
    },
    colorStyle() {
      return {
        color: this.child.effectiveColor,
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
