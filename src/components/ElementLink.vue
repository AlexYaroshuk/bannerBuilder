<template>
  <div class="element-link">
    <a :href="child.URL" target="_blank" :style="typographyStyle">
      {{ child.value }}
    </a>
  </div>
</template>

<script>
export default {
  props: {
    child: {
      type: Object,
      required: true,
    },
  },
  computed: {
    typographyStyle() {
      const styles = this.child.getEffectiveStyles();
      return {
        color: styles.color,
        /*        fontFamily: styles.fontFamily,
        fontWeight: styles.fontWeight,
        fontSize: `${styles.fontSize}px`, */
      };
    },
  },
};
</script>

<style scoped>
/* .element-link a {
  color: inherit;
} */
</style>
